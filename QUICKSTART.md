# 🚀 Quick Start Guide - Monad Idol

## Prerequisites

1. **Foundry** installed
2. **Node.js 18+** installed
3. **pnpm** installed (`npm install -g pnpm`)
3. **MetaMask** wallet extension
4. **Monad testnet tokens** (get from faucet)
5. **Anthropic API key** (from https://console.anthropic.com/)

## Setup (5 minutes)

### 1. Install Foundry

```bash
# Windows (PowerShell)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Linux/Mac
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies

```bash
# Foundry dependencies
forge install

# All Node.js dependencies (from root)
pnpm install
```

### 3. Configure Environment

Create `.env` file in root:

```env
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_private_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Deploy & Run (10 minutes)

### 4. Compile & Deploy Contracts

```bash
# Compile
forge build

# Deploy to Monad testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url monad \
  --broadcast \
  -vvvv
```

**Save the contract addresses from the output!**

### 5. Update Frontend Config

Create `frontend/.env`:

```env
VITE_TOKEN_ADDRESS=<from_deployment>
VITE_REGISTRY_ADDRESS=<from_deployment>
VITE_FUNDING_POOL_ADDRESS=<from_deployment>
```

### 6. Start AI Agent

```bash
# From root directory
pnpm ai-agent
```

Keep this terminal open.

### 7. Start Frontend

In a new terminal:

```bash
# From root directory
pnpm frontend
```

Open http://localhost:3000

## Usage

1. **Connect Wallet** - Click "Connect MetaMask"
2. **Submit Project** - Go to "Submit Project" tab
3. **AI Evaluates** - Watch AI agent terminal for evaluation
4. **Stake Tokens** - Go to "All Projects" and stake on favorites
5. **View Rankings** - Check "Leaderboard" for top 3

## Troubleshooting

- **No Foundry?** Install with `curl -L https://foundry.paradigm.xyz | bash`
- **No tokens?** Get from Monad faucet
- **AI not working?** Check ANTHROPIC_API_KEY
- **Contracts not found?** Verify addresses in frontend/.env

## Next Steps

- [ ] Submit 3-5 test projects
- [ ] Test staking functionality
- [ ] Record demo video
- [ ] Deploy frontend to Vercel
- [ ] Submit to hackathon!

---

**Need help?** Check `DEPLOYMENT.md` for detailed Foundry instructions.
