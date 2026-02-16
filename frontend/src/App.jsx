import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { CONTRACTS, TOKEN_ABI, REGISTRY_ABI, FUNDING_POOL_ABI } from './config';
import { useGSAPAnimations } from './hooks/useGSAPAnimations';
import toastUtil from './utils/toast';
import { trackWalletConnect } from './utils/analytics';
import './config/reown';
import './reown-custom.css';
import './mascot.css';
import './welcome.css';
import Header from './components/Header';
import SubmitProject from './components/SubmitProject';
import ProjectList from './components/ProjectList';
import LeaderBoard from './components/LeaderBoard';

function App() {
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');

    // Initialize GSAP animations
    useGSAPAnimations();

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contracts, setContracts] = useState({});
    const [activeTab, setActiveTab] = useState('projects');

    // Initialize provider and contracts when wallet connects
    useEffect(() => {
        const initializeProvider = async () => {
            if (isConnected && walletProvider) {
                const loadingToast = toastUtil.loading('Connecting to Monad...');
                try {
                    const ethersProvider = new ethers.BrowserProvider(walletProvider);
                    const ethersSigner = await ethersProvider.getSigner();

                    setProvider(ethersProvider);
                    setSigner(ethersSigner);

                    // Initialize contracts
                    const tokenContract = new ethers.Contract(CONTRACTS.TOKEN, TOKEN_ABI, ethersSigner);
                    const registryContract = new ethers.Contract(CONTRACTS.REGISTRY, REGISTRY_ABI, ethersSigner);
                    const fundingPoolContract = new ethers.Contract(CONTRACTS.FUNDING_POOL, FUNDING_POOL_ABI, ethersSigner);

                    setContracts({
                        token: tokenContract,
                        registry: registryContract,
                        fundingPool: fundingPoolContract
                    });

                    toastUtil.dismiss(loadingToast);
                    toastUtil.success('✅ Connected to Monad!');

                    // Track wallet connection
                    trackWalletConnect(address);
                } catch (error) {
                    console.error('Error initializing provider:', error);
                    toastUtil.dismiss(loadingToast);
                    toastUtil.error('Failed to connect. Please try again.');
                }
            } else {
                // Reset state when disconnected
                setProvider(null);
                setSigner(null);
                setContracts({});
            }
        };

        initializeProvider();
    }, [isConnected, walletProvider]);

    return (
        <div className="min-h-screen">
            <Header account={address} />

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="hero-title text-7xl md:text-8xl font-black mb-4 monad-title">
                        MONAD IDOL
                    </h1>
                    <p className="hero-subtitle text-xl text-gray-300 max-w-2xl mx-auto">
                        AI-Powered Talent Discovery & Micro-Funding Platform
                    </p>
                    <p className="hero-subtitle text-gray-400 mt-2">
                        Submit your AI agent project, get evaluated by Claude AI, and compete for funding!
                    </p>
                </div>


                {!isConnected ? (
                    <div className="welcome-section text-center py-20">
                        <div className="max-w-4xl mx-auto">
                            {/* Welcome Title with Rotating Text */}
                            <div className="welcome-title mb-8">
                                <h2 className="text-5xl font-bold mb-4">
                                    <span className="gradient-text">Welcome </span>
                                    <span className="rotating-text gradient-text"></span>
                                    <span className="text-5xl">👋🏼</span>
                                </h2>
                                <p className="welcome-subtitle text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                    Connect your wallet using the button in the top right to submit projects,
                                    stake on favorites, and participate in Monad Idol!
                                </p>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                <div className="feature-card glass p-8 rounded-2xl hover:scale-105 transition-transform">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Submit Projects</h3>
                                    <p className="text-gray-400">
                                        Showcase your AI agent projects to the community
                                    </p>
                                </div>

                                <div className="feature-card glass p-8 rounded-2xl hover:scale-105 transition-transform">
                                    <div className="text-6xl mb-4">🤖</div>
                                    <h3 className="text-xl font-bold mb-2 text-white">AI Evaluation</h3>
                                    <p className="text-gray-400">
                                        Get evaluated by Claude AI for quality and innovation
                                    </p>
                                </div>

                                <div className="feature-card glass p-8 rounded-2xl hover:scale-105 transition-transform">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Win Funding</h3>
                                    <p className="text-gray-400">
                                        Compete for funding and community recognition
                                    </p>
                                </div>
                            </div>

                            {/* CTA Hint */}
                            <div className="cta-hint mt-12 p-6 glass rounded-xl inline-block">
                                <p className="text-monad-purple-light font-semibold flex items-center gap-2">
                                    <span className="animate-pulse">👆</span>
                                    Click "Connect Wallet" in the top right to get started
                                    <span className="animate-pulse">👆</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex justify-center gap-4 mb-8">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`tab-button px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'projects'
                                    ? 'bg-gradient-to-r from-monad-purple to-monad-purple-light'
                                    : 'glass hover:bg-white/20'
                                    }`}
                            >
                                📋 All Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className={`tab-button px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'leaderboard'
                                    ? 'bg-gradient-to-r from-monad-purple to-monad-purple-light'
                                    : 'glass hover:bg-white/20'
                                    }`}
                            >
                                🏆 Leaderboard
                            </button>
                            <button
                                onClick={() => setActiveTab('submit')}
                                className={`tab-button px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'submit'
                                    ? 'bg-gradient-to-r from-monad-purple to-monad-purple-light'
                                    : 'glass hover:bg-white/20'
                                    }`}
                            >
                                ✨ Submit Project
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-w-6xl mx-auto">
                            {activeTab === 'submit' && (
                                <SubmitProject contracts={contracts} account={address} />
                            )}

                            {activeTab === 'projects' && (
                                <ProjectList contracts={contracts} account={address} />
                            )}

                            {activeTab === 'leaderboard' && (
                                <LeaderBoard contracts={contracts} />
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Floating Mascot */}
            <div className="mascot-container">
                <div className="mascot-tooltip">
                    👋 Need help? Click Connect Wallet to get started!
                </div>
                <img
                    src="/monad_idol_mascot.png"
                    alt="Monad Idol Mascot"
                    className="mascot-image"
                />
            </div>

            {/* Footer */}
            <footer className="text-center py-8 text-gray-400">
                <p>Built with ❤️ for Moltiverse</p>
                <p className="text-sm mt-2">Powered by Gemini AI & Monad Blockchain</p>
            </footer>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1A1A24',
                        color: '#fff',
                    },
                }}
            />

            {/* Vercel Analytics */}
            <Analytics />
        </div>
    );
}

export default App;
