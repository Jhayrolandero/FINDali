"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { defineChain } from "viem";

// Define Anvil local chain
const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  network: "anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  testnet: true,
});

// Determine which chain to use based on environment
const isLocalDev = process.env.NEXT_PUBLIC_USE_LOCAL_CHAIN === "true";
const activeChain = isLocalDev ? anvil : baseSepolia;

const wagmiConfig = createConfig({
  chains: [baseSepolia, anvil],
  connectors: [
    coinbaseWallet({
      appName: "FindChain",
    }),
    injected(), // For MetaMask and other injected wallets
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={isLocalDev ? (anvil as any) : base}
      config={{
        appearance: {
          mode: "auto",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </OnchainKitProvider>
  );
}
