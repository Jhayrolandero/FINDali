# 🚀 Quick Start: Testing with Anvil

Get up and running with local blockchain testing in 5 minutes!

## Step 1️⃣: Install Forge Standard Library

```bash
npm run foundry:install
```

Or manually:
```bash
forge install foundry-rs/forge-std --no-commit
```

## Step 2️⃣: Install Dependencies

```bash
npm install @openzeppelin/contracts
```

## Step 3️⃣: Start Anvil

Open a **new terminal** and keep it running:

```bash
npm run anvil
```

Or directly:
```bash
anvil
```

You'll see 10 test accounts with private keys. Keep this terminal open!

## Step 4️⃣: Deploy Contract

In your **main terminal**:

```bash
npm run deploy:local
```

This will:
- Deploy FindChain contract to Anvil
- Update your `.env.local` automatically
- Update `lib/contract.ts` with the new address

## Step 5️⃣: Configure Environment

Create `.env.local` (if not created automatically):

```bash
# .env.local
NEXT_PUBLIC_USE_LOCAL_CHAIN=true
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0x... # Set by deploy script
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Step 6️⃣: Start Next.js

```bash
npm run dev
```

## Step 7️⃣: Configure MetaMask

### Add Anvil Network:
- **Network Name:** Anvil
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency:** ETH

### Import Test Account:
1. Settings → Import Account
2. Use private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
3. This gives you 10,000 test ETH!

## Step 8️⃣: Test!

1. Go to `http://localhost:3000`
2. Connect MetaMask (select Anvil network)
3. Start using the dApp!

---

## 🔄 Quick Commands

| Action | Command |
|--------|---------|
| Start Anvil | `npm run anvil` |
| Deploy contract | `npm run deploy:local` |
| Start Next.js | `npm run dev` |
| Install Foundry deps | `npm run foundry:install` |

## 📚 Full Documentation

See [ANVIL_TESTING_GUIDE.md](./ANVIL_TESTING_GUIDE.md) for detailed information.

## ⚠️ Important Notes

- **Never use Anvil private keys on real networks!**
- Keep Anvil running while testing
- Restart everything if you get weird errors
- Each time you restart Anvil, you need to redeploy

## 🆘 Problems?

1. **Can't deploy?** Make sure Anvil is running
2. **Contract not found?** Check `.env.local` has the address
3. **MetaMask errors?** Reset account in MetaMask settings
4. **Still stuck?** See troubleshooting in [ANVIL_TESTING_GUIDE.md](./ANVIL_TESTING_GUIDE.md)

Happy coding! 🎉

