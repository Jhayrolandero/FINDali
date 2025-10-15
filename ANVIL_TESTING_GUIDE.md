# Anvil Local Testing Guide

This guide will help you test your FindChain dApp locally using Anvil (Foundry's local blockchain) with AppKit wallet connections.

## 📋 Prerequisites

- Foundry installed (`foundryup` to update)
- MetaMask or another Web3 wallet
- Node.js and npm
- Your FindChain project dependencies installed (`npm install`)

## 🚀 Quick Start

### 1. Start Anvil

Open a terminal and start the Anvil local blockchain:

```bash
anvil
```

**Keep this terminal running!** Anvil will display 10 accounts with their private keys. You'll need these for testing.

**Default Account #0 (pre-configured in deploy script):**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 2. Install OpenZeppelin Contracts

If you haven't already:

```bash
npm install @openzeppelin/contracts
```

### 3. Deploy the Contract

In a new terminal (keep Anvil running):

```bash
./scripts/deploy-local.sh
```

This script will:
- ✅ Check if Anvil is running
- 🚀 Deploy the FindChain contract
- 📝 Update `.env.local` with the contract address
- 📝 Update `lib/contract.ts` with the contract address

**Note:** If you get a permission error, run: `chmod +x ./scripts/deploy-local.sh`

### 4. Configure Environment

Create or update `.env.local`:

```bash
cp .env.local.example .env.local
```

Add this line to enable local chain:

```env
NEXT_PUBLIC_USE_LOCAL_CHAIN=true
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=<address-from-deployment>
```

The deploy script should have already set the contract address.

### 5. Start Your Next.js App

```bash
npm run dev
```

### 6. Configure MetaMask

#### Add Anvil Network to MetaMask

1. Open MetaMask
2. Click the network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Enter the following:

   - **Network Name:** Anvil Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`

5. Click "Save"

#### Import an Anvil Account

1. Click your account icon → "Import Account"
2. Select "Private Key"
3. Paste one of the private keys from Anvil (e.g., the default one above)
4. Click "Import"

**⚠️ WARNING:** Never use these private keys on mainnet or real testnets!

### 7. Connect and Test

1. Navigate to `http://localhost:3000`
2. Connect your MetaMask wallet (make sure you're on the Anvil network)
3. Start testing your dApp!

## 🔄 Redeploying

If you make changes to the contract:

```bash
# Restart Anvil (Ctrl+C the old one, then):
anvil

# Deploy again
./scripts/deploy-local.sh

# Restart your Next.js app (sometimes needed)
npm run dev
```

## 🧪 Testing Different Accounts

Anvil provides 10 accounts by default. You can:

1. Import multiple accounts into MetaMask using their private keys
2. Switch between accounts to test different user scenarios
3. Each account starts with 10,000 ETH (perfect for testing!)

## 📝 Common Commands

### Manual Deployment

If you prefer to deploy manually:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Check Contract on Anvil

```bash
# Get contract code
cast code <CONTRACT_ADDRESS> --rpc-url http://localhost:8545

# Call a view function
cast call <CONTRACT_ADDRESS> "getTotalOpenBounties()(uint256)" --rpc-url http://localhost:8545
```

### Send a Test Transaction

```bash
# Mint a device (only owner can do this)
cast send <CONTRACT_ADDRESS> "mintDevice(string)(uint256)" "123456789012345" \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 🐛 Troubleshooting

### "Anvil is not running"

Make sure Anvil is running in another terminal. You should see output like:

```
                             _   _
                            (_) | |
      __ _   _ __   __   __  _  | |
     / _` | | '_ \  \ \ / / | | | |
    | (_| | | | | |  \ V /  | | | |
     \__,_| |_| |_|   \_/   |_| |_|
```

### "Contract not deployed" or "Invalid address"

1. Check `.env.local` has the correct `NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS`
2. Check `lib/contract.ts` has the correct address
3. Restart your Next.js dev server after updating env files

### MetaMask shows wrong balance or nonce errors

1. Reset MetaMask account:
   - Settings → Advanced → Clear activity tab data
2. Or disconnect and reconnect your wallet

### "Deployment failed"

1. Make sure OpenZeppelin contracts are installed:
   ```bash
   npm install @openzeppelin/contracts
   ```

2. Check that Anvil is running on port 8545

3. Try running forge commands directly to see detailed errors

### Contract interactions fail

1. Verify you're on the Anvil network in MetaMask (Chain ID: 31337)
2. Check that your account has ETH
3. Look at browser console for detailed error messages
4. Check Anvil terminal for transaction logs

## 🔄 Switching Between Local and Testnet

### For Local Development (Anvil):

```env
# .env.local
NEXT_PUBLIC_USE_LOCAL_CHAIN=true
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x... # Anvil deployment
```

### For Base Sepolia Testnet:

```env
# .env.local
NEXT_PUBLIC_USE_LOCAL_CHAIN=false
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x... # Sepolia deployment
```

## 📚 Advanced Topics

### Using Multiple Anvil Instances

Run Anvil on a different port:

```bash
anvil --port 8546
```

Update your RPC URLs accordingly in `rootProvider.tsx`.

### Forking a Real Network

Test with real network state:

```bash
# Fork Base Sepolia
anvil --fork-url https://sepolia.base.org
```

### Persistent State

Save blockchain state between restarts:

```bash
# Start with state
anvil --state ./anvil-state.json

# State is automatically saved when you close Anvil
```

### Deploying with Different Accounts

Use a different private key:

```bash
# Edit .env.local, change PRIVATE_KEY to another Anvil account
# Then run deployment script
./scripts/deploy-local.sh
```

## 🎯 Testing Workflow Example

Here's a complete testing workflow:

1. **Start Fresh:**
   ```bash
   # Terminal 1
   anvil
   
   # Terminal 2
   ./scripts/deploy-local.sh
   npm run dev
   ```

2. **Test Device Registration:**
   - Connect MetaMask (Account #0 - the owner)
   - Register a device with IMEI
   - Verify NFT minted

3. **Test Bounty Creation:**
   - Create a bounty for the device
   - Send some ETH with it
   - Verify bounty created

4. **Test Finding:**
   - Switch to Account #1 in MetaMask
   - Submit a claim with proof
   - Switch back to Account #0
   - Confirm the claim
   - Verify Account #1 received the bounty

5. **Test Open Bounty:**
   - Create an open bounty (no NFT needed)
   - Switch accounts and submit claims
   - Test confirmation/rejection

## 🔐 Security Notes

- **NEVER** use Anvil private keys on real networks
- The default Anvil keys are publicly known
- Always use fresh addresses for testnet/mainnet
- Keep `.env.local` in `.gitignore`

## 📞 Need Help?

If you encounter issues:

1. Check Anvil terminal for errors
2. Check browser console (F12) for errors
3. Check Next.js terminal for errors
4. Verify all environment variables are set
5. Try restarting everything (Anvil, Next.js, MetaMask)

Happy testing! 🚀

