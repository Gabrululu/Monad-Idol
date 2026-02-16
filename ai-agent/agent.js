const { ethers } = require("ethers");
require("dotenv").config();

/**
 * AI Agent for evaluating projects using Claude API
 */
class MonadIdolAIAgent {
    constructor(registryAddress, privateKey, rpcUrl) {
        this.registryAddress = registryAddress;
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);

        // ProjectRegistry ABI (minimal)
        this.registryABI = [
            "function projectCount() view returns (uint256)",
            "function getProject(uint256) view returns (tuple(uint256 id, address creator, string name, string description, string githubUrl, string metadataURI, uint256 aiScore, uint256 totalStaked, uint256 createdAt, bool funded, bool active))",
            "function updateAIScore(uint256 projectId, uint256 score) external",
            "event ProjectSubmitted(uint256 indexed projectId, address indexed creator, string name, uint256 timestamp)"
        ];

        this.registry = new ethers.Contract(
            registryAddress,
            this.registryABI,
            this.wallet
        );
    }

    /**
     * Evaluate a project using Claude AI
     */
    async evaluateProject(projectData) {
        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [{
                        role: "user",
                        content: `You are an expert evaluator for AI agent projects in a hackathon. Evaluate this project and provide a score from 0-100.

Project Details:
- Name: ${projectData.name}
- Description: ${projectData.description}
- GitHub URL: ${projectData.githubUrl}

Evaluation Criteria:
1. Innovation (30 points): Is this a novel approach? Does it solve a real problem creatively?
2. Technical Viability (30 points): Is the implementation feasible? Does it show technical competence?
3. Potential Impact (20 points): Could this make a meaningful difference in the ecosystem?
4. Presentation Clarity (20 points): Is the project well-documented and clearly explained?

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>",
  "breakdown": {
    "innovation": <0-30>,
    "viability": <0-30>,
    "impact": <0-20>,
    "clarity": <0-20>
  }
}`
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.statusText}`);
            }

            const data = await response.json();
            const evaluation = JSON.parse(data.content[0].text);

            return evaluation;
        } catch (error) {
            console.error("Error evaluating project:", error);
            // Return default score on error
            return {
                score: 50,
                reasoning: "Error during evaluation, assigned default score",
                breakdown: { innovation: 15, viability: 15, impact: 10, clarity: 10 }
            };
        }
    }

    /**
     * Update AI score on-chain
     */
    async updateScore(projectId, score) {
        try {
            console.log(`Updating score for project ${projectId}: ${score}`);
            const tx = await this.registry.updateAiScore(projectId, score);
            await tx.wait();
            console.log(`✅ Score updated! Transaction: ${tx.hash}`);
            return tx.hash;
        } catch (error) {
            console.error("Error updating score:", error);
            throw error;
        }
    }

    /**
     * Listen for new project submissions using polling (Monad doesn't support eth_newFilter)
     */
    async startListening() {
        console.log("🤖 AI Agent started listening for new projects (using polling)...\n");

        let lastProcessedProject = -1;

        // Poll every 10 seconds
        const pollInterval = 10000;

        const poll = async () => {
            try {
                const projectCount = await this.registry.projectCount();
                const currentCount = Number(projectCount);

                // Check if there are new projects
                if (currentCount > lastProcessedProject + 1) {
                    console.log(`\n📊 Found ${currentCount - lastProcessedProject - 1} new project(s)!`);

                    // Process all new projects
                    for (let i = lastProcessedProject + 1; i < currentCount; i++) {
                        try {
                            const project = await this.registry.getProject(i);

                            // Skip if already scored
                            if (Number(project.aiScore) > 0) {
                                console.log(`Project ${i} already scored, skipping...`);
                                lastProcessedProject = i;
                                continue;
                            }

                            console.log(`\n📢 New project detected!`);
                            console.log(`   ID: ${i}`);
                            console.log(`   Name: ${project.name}`);
                            console.log(`   Creator: ${project.creator}`);

                            // Evaluate with Claude
                            console.log(`\n🤔 Evaluating project with Claude AI...`);
                            const evaluation = await this.evaluateProject({
                                name: project.name,
                                description: project.description,
                                githubUrl: project.githubUrl
                            });

                            console.log(`\n📊 Evaluation Results:`);
                            console.log(`   Score: ${evaluation.score}/100`);
                            console.log(`   Reasoning: ${evaluation.reasoning}`);
                            console.log(`   Breakdown:`, evaluation.breakdown);

                            // Update score on-chain
                            await this.updateScore(i, evaluation.score);

                            lastProcessedProject = i;

                        } catch (error) {
                            console.error(`Error processing project ${i}:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error("@TODO Error:", error);
            }

            // Schedule next poll
            setTimeout(poll, pollInterval);
        };

        // Start polling
        poll();
    }

    /**
     * Evaluate all existing projects (for testing)
     */
    async evaluateAllProjects() {
        const projectCount = await this.registry.projectCount();
        console.log(`Found ${projectCount} projects to evaluate\n`);

        for (let i = 0; i < projectCount; i++) {
            try {
                const project = await this.registry.getProject(i);

                // Skip if already scored
                if (project.aiScore > 0) {
                    console.log(`Project ${i} already scored (${project.aiScore}), skipping...`);
                    continue;
                }

                console.log(`\nEvaluating Project ${i}: ${project.name}`);

                const evaluation = await this.evaluateProject({
                    name: project.name,
                    description: project.description,
                    githubUrl: project.githubUrl
                });

                console.log(`Score: ${evaluation.score}/100`);
                console.log(`Reasoning: ${evaluation.reasoning}`);

                await this.updateScore(i, evaluation.score);

                // Wait a bit between evaluations to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`Error evaluating project ${i}:`, error);
            }
        }
    }
}

// CLI interface
if (require.main === module) {
    const registryAddress = process.env.PROJECT_REGISTRY_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.MONAD_RPC_URL;

    if (!registryAddress || !privateKey || !rpcUrl) {
        console.error("❌ Missing environment variables!");
        console.error("Required: PROJECT_REGISTRY_ADDRESS, PRIVATE_KEY, MONAD_RPC_URL, ANTHROPIC_API_KEY");
        process.exit(1);
    }

    const agent = new MonadIdolAIAgent(registryAddress, privateKey, rpcUrl);

    const command = process.argv[2];

    if (command === "listen") {
        agent.startListening();
    } else if (command === "evaluate-all") {
        agent.evaluateAllProjects().then(() => {
            console.log("\n✅ All projects evaluated!");
            process.exit(0);
        });
    } else {
        console.log("Usage:");
        console.log("  node ai-agent/agent.js listen       - Listen for new projects");
        console.log("  node ai-agent/agent.js evaluate-all - Evaluate all existing projects");
        process.exit(1);
    }
}

module.exports = MonadIdolAIAgent;
