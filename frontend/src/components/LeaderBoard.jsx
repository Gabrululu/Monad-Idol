import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function LeaderBoard({ contracts }) {
    const [topProjects, setTopProjects] = useState([]);
    const [fundingPool, setFundingPool] = useState('0');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, [contracts.fundingPool, contracts.registry]);

    const loadLeaderboard = async () => {
        if (!contracts.fundingPool || !contracts.registry) return;

        try {
            setLoading(true);

            // Get funding pool balance
            const pool = await contracts.fundingPool.fundingPool();
            setFundingPool(ethers.formatEther(pool));

            // Get top projects
            const [projectIds, scores] = await contracts.fundingPool.getTopProjects();

            // Load project details
            const projectDetails = await Promise.all(
                projectIds.map(async (id, index) => {
                    const project = await contracts.registry.getProject(id);
                    return {
                        id: Number(id),
                        name: project.name,
                        creator: project.creator,
                        aiScore: Number(project.aiScore),
                        totalStaked: ethers.formatEther(project.totalStaked),
                        weightedScore: Number(scores[index]),
                        funded: project.funded
                    };
                })
            );

            setTopProjects(projectDetails);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '🏅';
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <p className="text-gray-300">Loading leaderboard...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold gradient-text mb-4">🏆 Leaderboard</h2>
                <p className="text-gray-300">Top projects competing for funding</p>
            </div>

            {/* Funding Pool */}
            <div className="card max-w-md mx-auto mb-8 text-center">
                <p className="text-sm text-gray-400 mb-2">Total Funding Pool</p>
                <p className="text-4xl font-bold gradient-text">
                    {parseFloat(fundingPool).toFixed(2)} TVT
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Distributed to top 3 projects weekly
                </p>
            </div>

            {/* Top Projects */}
            {topProjects.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-xl text-gray-300">No projects yet</p>
                    <p className="text-gray-400 mt-2">Submit a project to get started!</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {topProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`card ${index === 0
                                ? 'border-2 border-yellow-400 shadow-xl shadow-yellow-400/20'
                                : index === 1
                                    ? 'border-2 border-gray-300 shadow-lg shadow-gray-300/20'
                                    : index === 2
                                        ? 'border-2 border-orange-400 shadow-lg shadow-orange-400/20'
                                        : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Rank */}
                                <div className="text-5xl">{getMedalEmoji(index)}</div>

                                {/* Project Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold">{project.name}</h3>
                                        {project.funded && (
                                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                                                Funded
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        by {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                                    </p>

                                    {/* Scores */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400">AI Score</p>
                                            <p className="font-bold text-monad-purple-light">{project.aiScore}/100</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Community Stake</p>
                                            <p className="font-bold text-monad-accent">
                                                {parseFloat(project.totalStaked).toFixed(2)} TVT
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Weighted Score</p>
                                            <p className="font-bold text-monad-purple">{project.weightedScore}/100</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rank Number */}
                                <div className="text-right">
                                    <p className="text-4xl font-bold text-gray-600">#{index + 1}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="card max-w-3xl mx-auto mt-8">
                <h3 className="font-semibold mb-3">📊 How Rankings Work</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                    <li>
                        • <strong>Weighted Score</strong> = AI Score (70%) + Community Stake Weight (30%)
                    </li>
                    <li>
                        • <strong>AI Score</strong>: Claude AI evaluates projects on innovation, viability,
                        impact, and clarity
                    </li>
                    <li>
                        • <strong>Community Stake</strong>: Users stake tokens on projects they believe in
                    </li>
                    <li>
                        • <strong>Top 3 projects</strong> receive proportional funding from the pool weekly
                    </li>
                </ul>
            </div>
        </div>
    );
}
