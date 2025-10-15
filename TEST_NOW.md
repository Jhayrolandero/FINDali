# 🎯 Test Right Now!

You have Foundry and everything is set up. Let's test!

## 🚀 3 Commands to Start Testing

### Terminal 1: Start Anvil
```bash
anvil
```
**Leave this running!** You'll see 10 accounts with test ETH.

### Terminal 2: Deploy & Start App
```bash
# Deploy contract to Anvil
npm run deploy:local

# Start Next.js (after successful deployment)
npm run dev
```

That's it! The deploy script will:
- ✅ Auto-create `.env.local` with Anvil settings
- ✅ Deploy your FindChain contract
- ✅ Update the contract address everywhere
- ✅ Tell you exactly what to do next

## 🦊 Quick MetaMask Setup

### 1. Add Anvil Network
In MetaMask:
- Click network dropdown → "Add Network" → "Add manually"
- **Network Name:** `Anvil Local`
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency:** `ETH`
- Save!

### 2. Import Test Account
- Click account icon → "Import Account"
- Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- You now have 10,000 test ETH! 💰

### 3. Connect to Your App
- Go to `http://localhost:3000`
- Connect wallet
- Select **Anvil Local** network
- Start testing!

## 🧪 What You Can Test

1. **Register a Device** (NFT minting)
   - Only the contract owner (Account #0) can do this
   - Use a 15-digit IMEI

2. **Create a Bounty**
   - Register a device first
   - Create a bounty with some ETH
   - Switch to another account to claim it

3. **Submit Claims**
   - Switch to a different MetaMask account
   - Submit a claim with proof
   - Switch back to confirm/reject

4. **Open Bounties** (no NFT needed)
   - Create an open bounty with device description
   - Anyone can claim

5. **Found Listings**
   - Post a found device
   - Let owners claim it with a reward

## 🔄 Quick Reset

If something goes wrong:

```bash
# Stop everything (Ctrl+C in both terminals)

# Restart Anvil
anvil

# Redeploy (in another terminal)
npm run deploy:local

# Restart Next.js
npm run dev
```

## 📝 Useful Commands

```bash
# Check if Anvil is running
nc -z localhost 8545 && echo "✅ Running" || echo "❌ Not running"

# View deployed contract address
cat .env.local | grep FINDCHAIN_CONTRACT_ADDRESS

# Call a contract function directly
cast call $CONTRACT_ADDRESS "getTotalOpenBounties()(uint256)" --rpc-url http://localhost:8545

# Check account balance
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://localhost:8545
```

## 🐛 Quick Fixes

**"Deployment failed"**
→ Make sure Anvil is running in another terminal

**"Can't connect wallet"**
→ Make sure you added Anvil network to MetaMask and selected it

**"Invalid nonce" or weird MetaMask errors**
→ Settings → Advanced → Clear activity tab data

**"Contract not found"**
→ Check `.env.local` has `NEXT_PUBLIC_USE_LOCAL_CHAIN=true`

## 🎉 You're Ready!

Everything is set up. Just run the 3 commands above and start testing your dApp locally!

For more details, see [ANVIL_TESTING_GUIDE.md](./ANVIL_TESTING_GUIDE.md)

