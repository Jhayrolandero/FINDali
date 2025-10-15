# FindChain Smart Contract Integration Guide

This guide explains how the FindChain smart contract is integrated with the Next.js frontend using **OnchainAppKit** (Coinbase's OnchainKit) for wallet management and blockchain interactions.

## 📁 Project Structure

```
FindChain/
├── lib/
│   ├── contract.ts              # Contract ABI and address configuration
│   ├── helpers.ts               # Utility functions for formatting and validation
│   └── hooks/
│       ├── index.ts             # Central export for all hooks
│       ├── useNFTOperations.ts  # Hooks for device NFT minting and management
│       ├── useBountyOperations.ts      # Hooks for NFT-based bounties
│       ├── useOpenBountyOperations.ts  # Hooks for open bounties (no NFT required)
│       └── useFoundListingOperations.ts # Hooks for found item listings
├── app/
│   ├── rootProvider.tsx         # Wagmi & OnchainKit provider configuration
│   ├── register/page.tsx        # Device registration with contract integration
│   ├── my-devices/page.tsx      # User's devices management
│   ├── browse-lost/page.tsx     # Browse lost devices with bounties
│   └── browse-found/page.tsx    # Browse found items listings
└── components/
    └── ui/
        └── walletComponent.tsx  # Wallet connection UI component
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
NEXT_PUBLIC_FINDCHAIN_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
```

**Get Your API Key:**
- Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- Create a new project
- Copy your API key to the `.env.local` file

### 2. Update Contract Address

After deploying your FindChain contract, update the address in `lib/contract.ts`:

```typescript
export const FINDCHAIN_CONTRACT_ADDRESS = "0xYourDeployedContractAddress" as const;
```

### 3. Install Dependencies

All required dependencies are already in `package.json`:
- `@coinbase/onchainkit` - OnchainKit SDK
- `wagmi` - React Hooks for Ethereum
- `viem` - TypeScript Ethereum library

```bash
npm install
```

## 🎯 Core Integration Components

### 1. **Provider Configuration** (`app/rootProvider.tsx`)

Sets up Wagmi and OnchainKit providers:

```typescript
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [coinbaseWallet({ appName: "FindChain" })],
  transports: { [baseSepolia.id]: http() },
});

<OnchainKitProvider apiKey={apiKey} chain={baseSepolia}>
  <WagmiProvider config={wagmiConfig}>
    {children}
  </WagmiProvider>
</OnchainKitProvider>
```

### 2. **Contract Configuration** (`lib/contract.ts`)

- **Contract Address**: Deployed FindChain contract
- **ABI**: Complete contract interface for all functions
- Exported as constants for type safety

### 3. **Custom Hooks** (`lib/hooks/`)

Each hook provides a clean interface for contract interactions:

#### NFT Operations (`useNFTOperations.ts`)

```typescript
// Mint a device NFT
const { mintDevice, isPending, isConfirmed, hash } = useMintDevice();
mintDevice("123456789012345"); // 15-digit IMEI

// Check if IMEI is registered
const { isRegistered } = useCheckIMEI(imei);

// Transfer device NFT
const { transferDevice } = useTransferDevice();
transferDevice(tokenId, toAddress);
```

#### Bounty Operations (`useBountyOperations.ts`)

```typescript
// Create bounty for lost device
const { createBounty } = useCreateBounty();
createBounty(tokenId, "0.5"); // 0.5 ETH bounty

// Submit a claim
const { submitClaim } = useSubmitClaim();
submitClaim(tokenId, proofHash);

// Confirm/Reject claims (owner only)
const { confirmClaim } = useConfirmClaim();
confirmClaim(claimId);

// Get bounty information
const { bounty } = useGetBounty(tokenId);
```

#### Open Bounty Operations (`useOpenBountyOperations.ts`)

For devices without NFTs:

```typescript
// Create open bounty
const { createOpenBounty } = useCreateOpenBounty();
createOpenBounty("Lost iPhone 15 Pro, black", "0.3");

// Submit claim on open bounty
const { submitOpenClaim } = useSubmitOpenClaim();
submitOpenClaim(bountyId, proofHash);
```

#### Found Listing Operations (`useFoundListingOperations.ts`)

For finders to post what they found:

```typescript
// Create found listing
const { createFoundListing } = useCreateFoundListing();
createFoundListing("iPhone 15 with blue case", proofHash);

// Owner claims the listing (with optional reward)
const { claimFoundListing } = useClaimFoundListing();
claimFoundListing(listingId, "0.1"); // 0.1 ETH reward
```

### 4. **Helper Functions** (`lib/helpers.ts`)

Utility functions for common tasks:

```typescript
// Format ETH values
formatEthValue(bigIntValue, decimals);

// Shorten addresses for display
shortenAddress("0x1234...5678");

// Validate IMEI format
validateIMEI(imei);

// Get block explorer URLs
getBlockExplorerUrl(txHash);
getAddressExplorerUrl(address);

// Upload to IPFS (placeholder)
uploadToIPFS(files);
```

## 💡 Usage Examples

### Example 1: Minting a Device NFT

```typescript
"use client";
import { useMintDevice, useCheckIMEI } from "@/lib/hooks";
import { useAccount } from "wagmi";

function RegisterDevice() {
  const { address, isConnected } = useAccount();
  const { mintDevice, isPending, isConfirmed, hash, error } = useMintDevice();
  const { isRegistered } = useCheckIMEI(imei);

  const handleMint = () => {
    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }
    if (isRegistered) {
      alert("IMEI already registered");
      return;
    }
    mintDevice(imei);
  };

  return (
    <div>
      <input value={imei} onChange={(e) => setImei(e.target.value)} />
      <button onClick={handleMint} disabled={isPending || isConfirmed}>
        {isPending ? "Confirm in wallet..." : "Mint Device NFT"}
      </button>
      {isConfirmed && <p>Success! TX: {hash}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Example 2: Creating a Bounty

```typescript
"use client";
import { useCreateBounty, useGetBounty } from "@/lib/hooks";

function CreateBountyForm({ tokenId }: { tokenId: bigint }) {
  const { createBounty, isPending, isConfirmed } = useCreateBounty();
  const { bounty, refetch } = useGetBounty(tokenId);
  const [amount, setAmount] = useState("0.5");

  const handleCreate = () => {
    createBounty(tokenId, amount);
  };

  // Refetch bounty data after confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed]);

  return (
    <div>
      {bounty?.active ? (
        <p>Active Bounty: {formatEther(bounty.amount)} ETH</p>
      ) : (
        <>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Creating..." : "Create Bounty"}
          </button>
        </>
      )}
    </div>
  );
}
```

### Example 3: Submitting a Claim

```typescript
"use client";
import { useSubmitClaim } from "@/lib/hooks";
import { createProofHash } from "@/lib/helpers";

function SubmitClaimForm({ tokenId }: { tokenId: bigint }) {
  const { submitClaim, isPending, isConfirmed, hash } = useSubmitClaim();
  const [proofImages, setProofImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    // Upload images to IPFS and get hash
    const proofHash = await createProofHash({
      images: proofImages,
      // ... other proof data
    });
    
    submitClaim(tokenId, proofHash);
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        onChange={(e) => setProofImages(Array.from(e.target.files || []))}
      />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Claim"}
      </button>
      {isConfirmed && (
        <p>Claim submitted! TX: <a href={getBlockExplorerUrl(hash)}>{hash}</a></p>
      )}
    </div>
  );
}
```

## 🔐 Wallet Connection

The wallet connection is handled by OnchainKit's `ConnectWallet` component in `components/ui/walletComponent.tsx`:

```typescript
import { ConnectWallet, Wallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
import { Identity, Avatar, Name, Address } from "@coinbase/onchainkit/identity";

<Wallet>
  <ConnectWallet>
    <Avatar />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity hasCopyAddressOnClick>
      <Avatar />
      <Name />
      <Address />
    </Identity>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
```

## 📊 Transaction Flow

### Device Registration Flow:
1. User connects wallet via OnchainKit
2. User enters IMEI and device details
3. `useCheckIMEI` validates IMEI isn't already registered
4. `useMintDevice` calls contract's `mintDevice` function
5. User confirms transaction in wallet
6. Hook tracks transaction status: `isPending` → `isConfirming` → `isConfirmed`
7. Success page displays transaction hash with BaseScan link

### Bounty Creation Flow:
1. User selects device NFT they own
2. Enters bounty amount in ETH
3. `useCreateBounty` calls `createBounty` with ETH value
4. Contract holds ETH in escrow
5. Event emitted: `BountyCreated`

### Claim Submission Flow:
1. Finder uploads proof images
2. Images uploaded to IPFS (or storage solution)
3. `useSubmitClaim` calls `submitClaim` with proof hash
4. Claim stored on-chain
5. Owner notified to review claim

### Claim Confirmation Flow:
1. Owner reviews claim details
2. `useConfirmClaim` calls `confirmClaim`
3. Contract transfers bounty to finder
4. Bounty marked as inactive
5. Event emitted: `ClaimConfirmed`

## 🎨 UI Patterns

### Loading States

```typescript
const { mintDevice, isPending, isConfirming, isConfirmed } = useMintDevice();

{isPending && <Spinner text="Waiting for wallet..." />}
{isConfirming && <Spinner text="Transaction confirming..." />}
{isConfirmed && <Success text="Device minted!" />}
```

### Error Handling

```typescript
const { mintDevice, error } = useMintDevice();

{error && (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

### Transaction Links

```typescript
import { getBlockExplorerUrl } from "@/lib/helpers";

{hash && (
  <a href={getBlockExplorerUrl(hash)} target="_blank">
    View on BaseScan
  </a>
)}
```

## 🚀 Deployment Checklist

- [ ] Deploy FindChain contract to Base Sepolia
- [ ] Update `FINDCHAIN_CONTRACT_ADDRESS` in `lib/contract.ts`
- [ ] Set `NEXT_PUBLIC_ONCHAINKIT_API_KEY` in `.env.local`
- [ ] Test wallet connection
- [ ] Test device minting
- [ ] Test bounty creation
- [ ] Test claim submission
- [ ] Test claim confirmation/rejection
- [ ] Implement IPFS/storage solution for proof images
- [ ] Deploy to production (Vercel/Netlify)
- [ ] Update contract address for Base Mainnet (when ready)

## 🔄 Future Enhancements

1. **Event Listening**: Add contract event listeners to update UI in real-time
2. **Multicall**: Batch multiple read calls for better performance
3. **Subgraph**: Index contract events for efficient querying
4. **IPFS Integration**: Replace mock `uploadToIPFS` with real implementation
5. **ENS Resolution**: Display ENS names for wallet addresses
6. **Notifications**: Alert users when they receive claims or bounties

## 📚 Resources

- [OnchainKit Docs](https://onchainkit.xyz/)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [Base Docs](https://docs.base.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## 🆘 Troubleshooting

### "Wallet not connected"
- Ensure OnchainKitProvider is wrapping your app
- Check wallet connection state with `useAccount()`

### "Transaction failed"
- Check you're on correct network (Base Sepolia)
- Ensure wallet has sufficient ETH for gas
- Verify contract address is correct

### "IMEI already registered"
- Each IMEI can only be minted once
- Use `useCheckIMEI` to validate before minting

### "Not the device owner"
- Only NFT owner can create bounties for that device
- Check ownership with `useTokenOwner`

## 📝 Notes

- All hooks use TypeScript for type safety
- Transaction hashes are automatically tracked
- Error messages are user-friendly and actionable
- Loading states are consistent across all operations
- All monetary values use viem's `parseEther` and `formatEther` for accuracy

---

**Built with ❤️ using OnchainAppKit**

