# 🎤 Monad Idol

**AI-Powered Talent Discovery & Micro-Funding Platform**

Monad Idol is a decentralized platform that combines AI evaluation with community governance to discover, rank, and fund the best AI agent projects on Monad.

## 🎯 Concept

An AI agent (powered by Claude) automatically evaluates and ranks submitted projects, assigns micro-funding, and allows the community to stake tokens to influence funding decisions.

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Claude AI Agent (Project Evaluation)
    ↓
Smart Contracts (Monad EVM)
    ├── TalentVaultToken.sol (ERC20 Governance Token)
    ├── ProjectRegistry.sol (Project Submissions)
    └── FundingPool.sol (Staking & Distribution)
```

## 🚀 Features

- **AI Evaluation**: Claude AI analyzes projects and assigns scores (0-100)
- **Community Staking**: Users stake tokens on their favorite projects
- **Automatic Funding**: Top 3 projects receive micro-funding automatically
- **Hybrid Governance**: AI provides initial scores, community amplifies with stakes

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Blockchain**: Solidity + Foundry → Monad Testnet
- **AI**: Claude API (Sonnet 4)
- **Web3**: ethers.js
- **Hosting**: Vercel + IPFS

## 📦 Project Structure

```
monad-idol/
├── contracts/          # Solidity smart contracts
├── script/            # Foundry deployment scripts
├── frontend/          # React application
├── ai-agent/          # Claude AI integration
└── foundry.toml       # Foundry configuration
```

## 🎬 Getting Started

### Prerequisites

- Foundry installed
- Node.js 18+
- pnpm installed (`npm install -g pnpm`)
- MetaMask wallet
- Monad testnet tokens

### Installation

```bash
# Install Foundry dependencies
forge install

# Install all Node dependencies (from root)
pnpm install

# Compile contracts
forge build

# Deploy to Monad testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url monad \
  --broadcast

# Start AI agent (from root)
pnpm ai-agent

# Start frontend (from root, in another terminal)
pnpm frontend
```

## 📋 How It Works

1. **Submit Project**: Creators submit their AI agent projects
2. **AI Evaluation**: Claude analyzes and scores the project (0-100)
3. **Community Staking**: Users stake tokens on projects they believe in
4. **Funding Distribution**: Top 3 projects receive automatic funding

## 🏆 Evaluation Criteria

- **Innovation** (30 pts): Novel approach and creativity
- **Technical Viability** (30 pts): Feasibility and implementation quality
- **Potential Impact** (20 pts): Value to the ecosystem
- **Presentation Clarity** (20 pts): Clear documentation and demo

## 📝 License

MIT

## 🤝 Built for Monad Hackathon 2026
