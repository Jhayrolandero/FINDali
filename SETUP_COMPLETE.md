# ✅ Anvil Testing Setup - Complete!

I've set up everything you need to test your FindChain dApp locally with Anvil and AppKit wallet connections.

## 📦 What Was Set Up

### 1. **Foundry Configuration** (`foundry.toml`)
- Configured Solidity compiler
- Set up proper paths for contracts and dependencies
- Added OpenZeppelin remappings

### 2. **Smart Contract Setup**
- ✅ Contract copied to `contracts/FindChain.sol`
- ✅ Deployment script created at `script/Deploy.s.sol`
- ✅ OpenZeppelin contracts added to dependencies

### 3. **Deployment Script** (`scripts/deploy-local.sh`)
A bash script that:
- Checks if Anvil is running
- Auto-creates `.env.local` if missing
- Deploys the contract to Anvil
- Updates `.env.local` with the contract address
- Updates `lib/contract.ts` with the contract address
- Provides helpful next steps

**Key Fix:** The script now properly exports environment variables so `forge` can read them.

### 4. **Updated Root Provider** (`app/rootProvider.tsx`)
Enhanced to support:
- ✅ **Anvil local chain** (Chain ID: 31337)
- ✅ **Base Sepolia** (for testnet)
- ✅ Both Coinbase Wallet and injected wallets (MetaMask)
- ✅ Easy switching via `NEXT_PUBLIC_USE_LOCAL_CHAIN` env variable

The provider now defines the Anvil chain and includes it in the wagmi config alongside Base Sepolia.

### 5. **Environment Configuration**
- `.env.local` is auto-generated with:
  - Default Anvil private key
  - `NEXT_PUBLIC_USE_LOCAL_CHAIN=true`
  - Contract address (updated after deployment)

### 6. **NPM Scripts** (Updated `package.json`)
```json
"anvil": "anvil"                    // Start Anvil
"deploy:local": "bash ./scripts/deploy-local.sh"  // Deploy contract
"foundry:install": "forge install foundry-rs/forge-std"  // Install Forge std lib
```

### 7. **Documentation**
- 📘 **TEST_NOW.md** - Ultra-quick start guide (3 commands to start testing)
- 📗 **ANVIL_TESTING_GUIDE.md** - Comprehensive testing guide
- 📙 **QUICK_START_ANVIL.md** - Step-by-step setup
- 📄 **This file** - Setup summary

### 8. **Updated `.gitignore`**
Added Foundry-specific ignores:
```
cache/
out/
broadcast/
lib/forge-std/
```

## 🎯 How It Works

### The Flow:

1. **Anvil starts** → Local blockchain running on `http://127.0.0.1:8545`
2. **Deploy script runs** → Compiles and deploys FindChain contract
3. **Environment updated** → Contract address saved to `.env.local` and `lib/contract.ts`
4. **Next.js app reads** → `NEXT_PUBLIC_USE_LOCAL_CHAIN=true` tells it to use Anvil
5. **Wagmi connects** → RootProvider configures Anvil chain for wallet connections
6. **MetaMask connects** → You add Anvil network and import test account
7. **Start testing!** → All contract interactions go through Anvil

### AppKit + Wagmi + Anvil Integration:

```typescript
// The magic happens in rootProvider.tsx:

// 1. Define Anvil chain
const anvil = defineChain({
  id: 31337,
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } }
})

// 2. Add to wagmi config
const wagmiConfig = createConfig({
  chains: [baseSepolia, anvil],  // Both chains available
  connectors: [coinbaseWallet(), injected()],  // Multiple wallets
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545")  // Anvil transport
  }
})

// 3. OnchainKit uses the selected chain
<OnchainKitProvider chain={isLocalDev ? anvil : base}>
  <WagmiProvider config={wagmiConfig}>
    {/* Your app with wallet connections */}
  </WagmiProvider>
</OnchainKitProvider>
```

## 🚀 Quick Start (Repeat This)

```bash
# Terminal 1
anvil

# Terminal 2
npm run deploy:local
npm run dev

# Browser
# → Add Anvil network to MetaMask
# → Import account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# → Visit http://localhost:3000
# → Connect wallet
```

## 🔄 Switching Networks

### Local Development (Anvil)
```env
# .env.local
NEXT_PUBLIC_USE_LOCAL_CHAIN=true
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x... # From Anvil deployment
```

### Base Sepolia Testnet
```env
# .env.local
NEXT_PUBLIC_USE_LOCAL_CHAIN=false
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x... # From Sepolia deployment
```

Just restart your Next.js server after changing!

## 🧪 Testing Features

Your contract supports:

1. **NFT Device Registration** (`mintDevice`)
   - Register devices by IMEI
   - Creates NFT ownership

2. **Bounties** (`createBounty`, `submitClaim`, `confirmClaim`)
   - Device owner creates bounty
   - Finders submit claims
   - Owner confirms to release funds

3. **Open Bounties** (`createOpenBounty`, `submitOpenClaim`)
   - For devices without NFTs
   - Anyone can create, anyone can claim

4. **Found Listings** (`createFoundListing`, `claimFoundListing`)
   - Finders post found items
   - Owners claim with optional reward

All of this is testable on Anvil without spending real money!

## 🎨 Multiple Account Testing

Anvil gives you 10 accounts. Import multiple into MetaMask:

**Account #0** (Owner/Deployer)
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1** (Tester)
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account #2** (Another Tester)
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

Switch between them in MetaMask to simulate different users!

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Deployment fails | Make sure Anvil is running (`anvil` in another terminal) |
| Can't connect wallet | Add Anvil network to MetaMask (Chain ID: 31337) |
| Contract not found | Check `.env.local` has correct address and `USE_LOCAL_CHAIN=true` |
| Nonce errors | Reset MetaMask account (Settings → Advanced → Clear activity) |
| Module not found | Run `npm install @openzeppelin/contracts` |

## 📚 Documentation Files

- **START HERE:** [TEST_NOW.md](./TEST_NOW.md) - Fastest way to start
- **Step-by-Step:** [QUICK_START_ANVIL.md](./QUICK_START_ANVIL.md)
- **Full Guide:** [ANVIL_TESTING_GUIDE.md](./ANVIL_TESTING_GUIDE.md)
- **This Summary:** SETUP_COMPLETE.md

## ⚠️ Important Notes

1. **Never use Anvil keys on real networks!** These are publicly known test keys
2. **Restart Anvil = Redeploy contract** - Blockchain state is lost when Anvil stops
3. **Environment variables** - Restart Next.js after changing `.env.local`
4. **MetaMask network** - Make sure you're on "Anvil Local" when testing

## 🎉 What's Next?

1. Run `anvil` in one terminal
2. Run `npm run deploy:local` in another
3. Run `npm run dev`
4. Configure MetaMask
5. Start testing your dApp!

Everything is configured and ready. You can now test all your smart contract features locally without spending real ETH or using a testnet. The wallet connection works exactly like it would on a real network, but everything happens on your local machine.

**Happy Testing! 🚀**

---

### Questions?

Check the guides or look at:
- Deployment script: `scripts/deploy-local.sh`
- Wallet config: `app/rootProvider.tsx`
- Contract config: `lib/contract.ts`
- Environment: `.env.local`

