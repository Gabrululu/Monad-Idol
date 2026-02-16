import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

// Monad Testnet configuration
export const monadTestnet = {
    id: 10143,
    name: 'Monad Testnet',
    network: 'monad-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://rpc.monad.xyz'],
        },
        public: {
            http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://rpc.monad.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'MonadScan',
            url: 'https://explorer.monad.xyz',
        },
    },
    testnet: true,
};

// Project metadata
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

// Use a default project ID for localhost development if not set
const defaultProjectId = 'a01e2d3f4b5c6d7e8f9a0b1c2d3e4f5a';

if (!projectId) {
    console.warn('⚠️ VITE_REOWN_PROJECT_ID is not set, using default localhost project ID');
}

const metadata = {
    name: 'Monad Idol',
    description: 'AI-Powered Talent Discovery & Micro-Funding Platform',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://monad-idol.vercel.app',
    icons: ['https://monad-idol.vercel.app/logo.png'],
};

// Create Ethers adapter
const ethersAdapter = new EthersAdapter();

// Create AppKit instance
const modal = createAppKit({
    adapters: [ethersAdapter],
    networks: [monadTestnet],
    metadata,
    projectId: projectId || defaultProjectId,
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'github', 'discord'],
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-color-mix': '#8247E5',
        '--w3m-accent': '#8247E5',
        '--w3m-color-mix-strength': 40,
        '--w3m-border-radius-master': '12px',
        '--w3m-font-family': 'Inter, system-ui, sans-serif',
        '--wui-color-accent-100': '#8247E5',
        '--wui-color-accent-090': '#8247E5',
        '--wui-color-accent-080': '#8247E5',
    },
});

export { modal, ethersAdapter };
