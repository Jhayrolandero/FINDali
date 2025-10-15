# Environment Variables Template

Create a `.env.local` file in your project root with the following variables:

```env
# OnchainKit API Key (Get from Coinbase Developer Platform)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Project Name
NEXT_PUBLIC_PROJECT_NAME=FindChain

# Contract Address (Replace with your deployed FindChain contract address)
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Chain ID (84532 for Base Sepolia, 8453 for Base Mainnet)
NEXT_PUBLIC_CHAIN_ID=84532
```

## How to Get Your OnchainKit API Key

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Sign in or create an account
3. Create a new project
4. Copy your API key
5. Paste it in your `.env.local` file

## After Deploying Your Contract

Once you've deployed the FindChain smart contract:

1. Copy the deployed contract address
2. Update `NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS` in `.env.local`
3. Also update the address in `lib/contract.ts`:
   ```typescript
   export const FINDCHAIN_CONTRACT_ADDRESS = "0xYourContractAddress" as const;
   ```

## Network Configuration

- **Base Sepolia (Testnet)**: Chain ID `84532`
- **Base Mainnet**: Chain ID `8453`

The current configuration in `app/rootProvider.tsx` uses Base Sepolia for testing.

