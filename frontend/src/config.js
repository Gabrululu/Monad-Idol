// Contract addresses - Update after deployment
export const CONTRACTS = {
    TOKEN: import.meta.env.VITE_TOKEN_ADDRESS || '',
    REGISTRY: import.meta.env.VITE_REGISTRY_ADDRESS || '',
    FUNDING_POOL: import.meta.env.VITE_FUNDING_POOL_ADDRESS || ''
};

// Monad Testnet configuration
export const MONAD_TESTNET = {
    chainId: '0xa1ee', // 41454 in hex
    chainName: 'Monad Testnet',
    nativeCurrency: {
        name: 'Monad',
        symbol: 'MON',
        decimals: 18
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet-explorer.monad.xyz']
};

// Contract ABIs
export const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

export const REGISTRY_ABI = [
    "function projectCount() view returns (uint256)",
    "function submitProject(string name, string description, string githubUrl, string metadataURI) returns (uint256)",
    "function getProject(uint256) view returns (tuple(uint256 id, address creator, string name, string description, string githubUrl, string metadataURI, uint256 aiScore, uint256 totalStaked, uint256 createdAt, bool funded, bool active))",
    "function getAllProjects() view returns (tuple(uint256 id, address creator, string name, string description, string githubUrl, string metadataURI, uint256 aiScore, uint256 totalStaked, uint256 createdAt, bool funded, bool active)[])",
    "event ProjectSubmitted(uint256 indexed projectId, address indexed creator, string name, uint256 timestamp)",
    "event ProjectScored(uint256 indexed projectId, uint256 score, uint256 timestamp)"
];

export const FUNDING_POOL_ABI = [
    "function stakeOnProject(uint256 projectId, uint256 amount)",
    "function unstake(uint256 projectId, uint256 amount)",
    "function getUserStake(uint256 projectId, address user) view returns (uint256)",
    "function getWeightedScore(uint256 projectId) view returns (uint256)",
    "function getTopProjects() view returns (uint256[], uint256[])",
    "function totalStaked(uint256) view returns (uint256)",
    "function fundingPool() view returns (uint256)",
    "function distributeFunds()",
    "event Staked(address indexed staker, uint256 indexed projectId, uint256 amount, uint256 timestamp)",
    "event Unstaked(address indexed staker, uint256 indexed projectId, uint256 amount, uint256 timestamp)"
];
