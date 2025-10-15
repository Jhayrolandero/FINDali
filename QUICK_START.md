# FindChain Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0xYourContractAddress
```

Get your API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/).

### 3. Update Contract Address

After deploying your contract, update the address in `lib/contract.ts`:

```typescript
export const FINDCHAIN_CONTRACT_ADDRESS = "0xYourDeployedAddress" as const;
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Test the Integration

### Step 1: Connect Wallet
1. Click "Log In" button in navigation
2. Connect your Coinbase Wallet or compatible wallet
3. Ensure you're on Base Sepolia network
4. Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

### Step 2: Register a Device
1. Navigate to "/register" page
2. Fill in device details:
   - Category, brand, model, color
   - **IMEI**: Enter a 15-digit number (e.g., `123456789012345`)
   - Description (optional)
   - Upload 1-3 proof images
3. Click "Continue to Minting"
4. Review details and click "Mint Device NFT"
5. Confirm transaction in your wallet
6. Wait for confirmation (usually ~2 seconds on Base)
7. Success! Your device is now an NFT

### Step 3: Create a Bounty
1. Go to "My Devices" page
2. Click "Report Lost" on a device
3. Enter bounty amount (e.g., `0.5` ETH)
4. Confirm transaction
5. ETH is now held in escrow by the smart contract

### Step 4: Submit a Claim
1. Find a lost device on "Browse Lost" page
2. Click "Submit Claim"
3. Upload proof images
4. Submit claim with proof hash
5. Owner will be notified

### Step 5: Confirm/Reject Claim
1. Device owner goes to "My Devices"
2. View claims on their lost device
3. Review proof submitted by finder
4. Confirm claim → Bounty released to finder
5. Or reject claim → Bounty stays in escrow

## 📦 Key Features Implemented

✅ **NFT Minting**: Register devices as ERC-721 NFTs
✅ **Bounty System**: Create ETH bounties with smart contract escrow
✅ **Claim Submission**: Finders submit proof hashes
✅ **Claim Management**: Owners confirm/reject claims
✅ **Open Bounties**: For devices without NFTs
✅ **Found Listings**: Finders post what they found
✅ **Wallet Integration**: Full OnchainKit integration
✅ **Transaction Tracking**: Real-time status updates
✅ **Error Handling**: User-friendly error messages

## 🔧 Available Hooks

All hooks are exported from `lib/hooks/index.ts`:

### NFT Operations
```typescript
import { useMintDevice, useCheckIMEI, useTransferDevice } from "@/lib/hooks";
```

### Bounty Operations
```typescript
import { 
  useCreateBounty, 
  useSubmitClaim, 
  useConfirmClaim,
  useRejectClaim,
  useCancelBounty 
} from "@/lib/hooks";
```

### Open Bounty Operations
```typescript
import {
  useCreateOpenBounty,
  useSubmitOpenClaim,
  useConfirmOpenClaim
} from "@/lib/hooks";
```

### Found Listing Operations
```typescript
import {
  useCreateFoundListing,
  useClaimFoundListing,
  useRemoveFoundListing
} from "@/lib/hooks";
```

## 🎨 Example: Create a Bounty Component

```typescript
"use client";
import { useState } from "react";
import { useCreateBounty } from "@/lib/hooks";
import { Button } from "@/components/ui/button";

export function CreateBountyButton({ tokenId }: { tokenId: bigint }) {
  const [amount, setAmount] = useState("0.5");
  const { createBounty, isPending, isConfirmed, error } = useCreateBounty();

  const handleCreate = () => {
    createBounty(tokenId, amount);
  };

  return (
    <div>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Bounty in ETH"
      />
      <Button onClick={handleCreate} disabled={isPending}>
        {isPending ? "Creating..." : "Create Bounty"}
      </Button>
      {isConfirmed && <p>✅ Bounty created successfully!</p>}
      {error && <p>❌ Error: {error.message}</p>}
    </div>
  );
}
```

## 📱 Pages Overview

- **`/`** - Landing page with features
- **`/register`** - Register new device as NFT ✅ **Integrated**
- **`/my-devices`** - Manage your registered devices
- **`/browse-lost`** - Browse lost devices with bounties
- **`/browse-found`** - Browse found items
- **`/my-points`** - View your reputation points

## 🔐 Security Notes

- ✅ IMEI is hashed on-chain (keccak256)
- ✅ Only device owner can create bounties
- ✅ Only bounty owner can confirm/reject claims
- ✅ ETH held in smart contract escrow
- ✅ No platform fees (Phase 1)

## 🐛 Common Issues

**"Please connect your wallet first"**
→ Click the "Log In" button and connect your wallet

**"IMEI already registered"**
→ Each IMEI can only be registered once. Try a different IMEI.

**"Insufficient funds"**
→ Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

**"Wrong network"**
→ Switch to Base Sepolia in your wallet

## 📚 Learn More

- [Full Integration Guide](./INTEGRATION_GUIDE.md)
- [OnchainKit Docs](https://onchainkit.xyz/)
- [Contract Source](./contract_copy/FindChain.sol)

## 🎉 You're Ready!

The integration is complete and ready to use. All contract functions are accessible through clean, typed React hooks. Happy building! 🚀

