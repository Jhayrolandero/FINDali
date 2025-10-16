# FindChain - Blockchain-Powered Lost & Found Platform

A decentralized platform for registering devices, posting bounties, and connecting finders with owners using NFT technology on Base blockchain.

## 🌐 Deployed Contract

**Network**: Base Sepolia (Testnet)  
**Contract Address**: `0xCcF255150E90a206EfCAebAC37a04C223232401b`  
**Chain ID**: `84532`  
**Block Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0xCcF255150E90a206EfCAebAC37a04C223232401b)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A wallet (MetaMask or Coinbase Wallet)
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_PROJECT_NAME=FindChain
```

Get your OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/).

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - How to integrate the smart contract
- **[Environment Template](./ENV_TEMPLATE.md)** - Environment variables reference

## 🔗 Learn More

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Base Network](https://base.org)
- [Wagmi Documentation](https://wagmi.sh)
