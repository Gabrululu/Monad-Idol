import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function ProjectCard({ project, contracts, account, onUpdate }) {
    const [stakeAmount, setStakeAmount] = useState('');
    const [userStake, setUserStake] = useState('0');
    const [staking, setStaking] = useState(false);

    useEffect(() => {
        loadUserStake();
    }, [project.id, account]);

    const loadUserStake = async () => {
        if (!contracts.fundingPool || !account) return;

        try {
            const stake = await contracts.fundingPool.getUserStake(project.id, account);
            setUserStake(ethers.formatEther(stake));
        } catch (error) {
            console.error('Error loading user stake:', error);
        }
    };

    const handleStake = async () => {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            setStaking(true);
            const amount = ethers.parseEther(stakeAmount);

            // First approve
            console.log('Approving tokens...');
            const approveTx = await contracts.token.approve(
                await contracts.fundingPool.getAddress(),
                amount
            );
            await approveTx.wait();

            // Then stake
            console.log('Staking tokens...');
            const stakeTx = await contracts.fundingPool.stakeOnProject(project.id, amount);
            await stakeTx.wait();

            alert('✅ Staked successfully!');
            setStakeAmount('');
            loadUserStake();
            onUpdate();
        } catch (error) {
            console.error('Error staking:', error);
            alert('Failed to stake. See console for details.');
        } finally {
            setStaking(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return '🌟 Excellent';
        if (score >= 60) return '👍 Good';
        if (score >= 40) return '👌 Fair';
        if (score > 0) return '🤔 Needs Work';
        return '⏳ Pending';
    };

    return (
        <div className="card hover:scale-[1.02] transition-transform">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400">
                        by {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                    </p>
                </div>

                {project.funded && (
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        💰 Funded
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>

            {/* GitHub Link */}
            {project.githubUrl && (
                <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-monad-blue hover:underline text-sm mb-4 block"
                >
                    🔗 View on GitHub →
                </a>
            )}

            {/* AI Score */}
            <div className="glass p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">AI Evaluation</span>
                    <span className="text-xs text-gray-400">{getScoreBadge(project.aiScore)}</span>
                </div>

                {project.aiScore > 0 ? (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-monad-purple to-monad-purple-light h-2 rounded-full transition-all"
                                    style={{ width: `${project.aiScore}%` }}
                                />
                            </div>
                            <span className={`text-2xl font-bold ${getScoreColor(project.aiScore)}`}>
                                {project.aiScore}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-400 text-sm">Waiting for AI evaluation...</p>
                )}
            </div>

            {/* Staking Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Total Staked</p>
                    <p className="font-bold">{parseFloat(project.totalStaked).toFixed(2)} TVT</p>
                </div>
                <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Your Stake</p>
                    <p className="font-bold">{parseFloat(userStake).toFixed(2)} TVT</p>
                </div>
            </div>

            {/* Stake Input */}
            <div className="flex gap-2">
                <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Amount to stake"
                    className="input-field flex-1 text-sm py-2"
                    min="0"
                    step="0.01"
                />
                <button
                    onClick={handleStake}
                    disabled={staking || !stakeAmount}
                    className="btn-primary px-4 py-2 text-sm"
                >
                    {staking ? '⏳' : '💎 Stake'}
                </button>
            </div>
        </div>
    );
}
