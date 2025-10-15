# FindChain Hook Architecture - What Uses What

## 📋 Quick Reference

### Files Using **Wagmi Hooks** (Cannot be replaced)

```
lib/hooks/useNFTOperations.ts
├─ import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
├─ useMintDevice() → useWriteContract()
├─ useTransferDevice() → useWriteContract()
├─ useCheckIMEI() → useReadContract()
├─ useTokenOwner() → useReadContract()
└─ useDeviceBalance() → useReadContract()

lib/hooks/useBountyOperations.ts
├─ import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
├─ useCreateBounty() → useWriteContract()
├─ useSubmitClaim() → useWriteContract()
├─ useConfirmClaim() → useWriteContract()
└─ useGetBounty() → useReadContract()

lib/hooks/useOpenBountyOperations.ts
├─ import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
├─ useCreateOpenBounty() → useWriteContract()
├─ useSubmitOpenClaim() → useWriteContract()
└─ useGetOpenBounty() → useReadContract()

lib/hooks/useFoundListingOperations.ts
├─ import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
├─ useCreateFoundListing() → useWriteContract()
├─ useClaimFoundListing() → useWriteContract()
└─ useGetFoundListing() → useReadContract()

app/register/page.tsx
└─ import { useAccount } from "wagmi"
   └─ const { address, isConnected } = useAccount()
```

### Files Using **OnchainKit Components**

```
components/ui/walletComponent.tsx
├─ import { ConnectWallet, Wallet, WalletDropdown } from "@coinbase/onchainkit/wallet"
├─ import { Identity, Avatar, Name, Address, EthBalance } from "@coinbase/onchainkit/identity"
└─ <Wallet><ConnectWallet><Avatar /><Name /></ConnectWallet></Wallet>

app/rootProvider.tsx
├─ import { OnchainKitProvider } from "@coinbase/onchainkit"
└─ <OnchainKitProvider><WagmiProvider>...</WagmiProvider></OnchainKitProvider>
```

## 🔍 Detailed Breakdown

### Every Hook in `lib/hooks/*` Uses Wagmi

```typescript
// lib/hooks/useNFTOperations.ts
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
//       ↑ THIS IS WAGMI - NOT OnchainKit!

export function useMintDevice() {
  // useWriteContract is from Wagmi, not OnchainKit
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  // useWaitForTransactionReceipt is from Wagmi
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  return { mintDevice, isPending, isConfirming, isConfirmed, hash, error };
}
```

**OnchainKit does NOT have:**
- ❌ `useWriteContract`
- ❌ `useReadContract`
- ❌ `useWaitForTransactionReceipt`
- ❌ Any hooks for custom contract interactions

### OnchainKit Only for UI Components

```typescript
// components/ui/walletComponent.tsx
import { ConnectWallet, Wallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
//       ↑ THIS IS OnchainKit - UI components only!

const WalletComponent = () => {
  return (
    <Wallet>  {/* OnchainKit UI component */}
      <ConnectWallet>  {/* OnchainKit UI component */}
        <Avatar />  {/* OnchainKit UI component */}
        <Name />    {/* OnchainKit UI component */}
      </ConnectWallet>
    </Wallet>
  );
};
```

**OnchainKit provides:**
- ✅ Pre-styled UI components
- ✅ Beautiful wallet connection button
- ✅ Identity/ENS display
- ✅ No coding required for wallet UI

## 📊 What Each Library Provides

### Wagmi Exports (React Hooks)
```typescript
import {
  // Account & Wallet
  useAccount,              // Get connected account info
  useConnect,              // Connect wallet
  useDisconnect,           // Disconnect wallet
  
  // Contracts
  useReadContract,         // ← WE USE THIS for reading contract data
  useReadContracts,        // Read multiple contracts
  useWriteContract,        // ← WE USE THIS for writing to contracts
  
  // Transactions
  useWaitForTransactionReceipt,  // ← WE USE THIS for tracking tx
  useSendTransaction,      // Send ETH
  useTransaction,          // Get transaction data
  
  // Balance & ENS
  useBalance,              // Get ETH/token balance
  useEnsName,              // Resolve ENS name
  useEnsAvatar,            // Get ENS avatar
  
  // Chain
  useChainId,              // Get current chain ID
  useSwitchChain,          // Switch networks
  
  // Config
  createConfig,            // Create wagmi config
  http,                    // HTTP transport
} from 'wagmi';

import { 
  baseSepolia,             // Chain configs
  base,
  mainnet,
} from 'wagmi/chains';

import {
  coinbaseWallet,          // Wallet connectors
  metaMask,
  walletConnect,
} from 'wagmi/connectors';
```

### OnchainKit Exports (React Components)
```typescript
import {
  // Wallet Components
  ConnectWallet,           // ← WE USE THIS for connect button
  Wallet,                  // ← WE USE THIS for wallet container
  WalletDropdown,          // ← WE USE THIS for dropdown
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';

import {
  // Identity Components
  Identity,                // ← WE USE THIS for user identity
  Avatar,                  // ← WE USE THIS for avatar
  Name,                    // ← WE USE THIS for ENS/Basename
  Address,                 // ← WE USE THIS for formatted address
  EthBalance,              // ← WE USE THIS for balance display
} from '@coinbase/onchainkit/identity';

import {
  // Transaction Components (we don't use yet)
  Transaction,
  TransactionButton,
  TransactionStatus,
} from '@coinbase/onchainkit/transaction';

import {
  // Swap Components (we don't use)
  Swap,
  SwapButton,
} from '@coinbase/onchainkit/swap';

import {
  // Provider
  OnchainKitProvider,      // ← WE USE THIS to wrap app
} from '@coinbase/onchainkit';
```

## 🎯 Key Takeaway

### For FindChain Smart Contract:

**Wagmi = Required** ✅
```typescript
// ALL our custom hooks use Wagmi
useMintDevice()        → useWriteContract (Wagmi)
useCreateBounty()      → useWriteContract (Wagmi)
useGetBounty()         → useReadContract (Wagmi)
useAccount()           → useAccount (Wagmi)
```

**OnchainKit = Optional (but makes UI nice)** 🎨
```typescript
// Only for wallet UI components
<ConnectWallet />      → OnchainKit component
<Avatar />             → OnchainKit component
<Name />               → OnchainKit component
```

## 🔄 Could We Remove OnchainKit?

**Yes, but you'd lose:**
- ❌ Beautiful wallet connect button
- ❌ ENS/Basename avatar resolution
- ❌ Pre-styled identity components
- ❌ Professional-looking wallet UI

**You'd have to build manually:**
```typescript
// Without OnchainKit, you'd need to code all this:
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';

function ManualWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  
  // Build your own UI from scratch
  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect</button>
      ) : (
        <div>
          {ensAvatar && <img src={ensAvatar} />}
          <span>{ensName || address}</span>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

**With OnchainKit, it's just:**
```typescript
import { ConnectWallet, Avatar, Name } from '@coinbase/onchainkit/wallet';

<ConnectWallet>
  <Avatar />
  <Name />
</ConnectWallet>
```

Much simpler! 🎉

## 🔄 Could We Remove Wagmi?

**NO!** ❌

Without Wagmi:
- ❌ OnchainKit won't work (it depends on Wagmi)
- ❌ Can't interact with FindChain contract
- ❌ Can't read/write blockchain data
- ❌ No way to get wallet address
- ❌ No transaction management

Wagmi is **REQUIRED**. It's the foundation everything is built on.

## 📦 Summary

| Aspect | Wagmi | OnchainKit |
|--------|-------|------------|
| **In FindChain** | Core functionality | UI polish |
| **Can remove?** | ❌ No - breaks everything | ✅ Yes - but UI looks worse |
| **Used in** | All hooks, contract interactions | Wallet UI only |
| **Provides** | Data & blockchain access | Beautiful components |
| **Required for** | App to work | App to look good |

**Final Answer:**
- Wagmi and OnchainKit are **complementary**, not alternatives
- Wagmi = Must have (the engine)
- OnchainKit = Nice to have (the paint job)
- OnchainKit **uses Wagmi internally** - can't replace it!

