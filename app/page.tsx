import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WalletComponent from "@/components/ui/walletComponent";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Award, Globe, Lock, MessageSquare, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Zap className="h-4 w-4" />
              Powered by Base Blockchain
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Lost Devices,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Found Faster
              </span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              The world's first NFT-verified lost and found platform. Prove
              ownership with blockchain, set ETH bounties, and recover your
              devices with cryptographic certainty.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Register Your Device
                  <Shield className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/browse-lost">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  Browse Lost Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why FindChain?
          </h2>
          <p className="text-lg text-muted-foreground">
            Revolutionary technology meets community-driven recovery
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">NFT Verification</h3>
            <p className="text-muted-foreground">
              Mint your device as an ERC-721 NFT. Only you know the IMEI -
              cryptographic proof of ownership that can't be faked.
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Smart Contract Escrow
            </h3>
            <p className="text-muted-foreground">
              Set ETH bounties with automatic escrow. Funds release only when
              you confirm the return - zero fraud risk.
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <MessageSquare className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Decentralized Chat</h3>
            <p className="text-muted-foreground">
              End-to-end encrypted messaging via XMTP. Coordinate returns
              privately without central servers.
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Award className="h-6 w-6 text-chart-4" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Reputation System</h3>
            <p className="text-muted-foreground">
              Build trust with wallet reputation scores. ENS names, account age,
              and successful returns create accountability.
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
              <Zap className="h-6 w-6 text-chart-5" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Priority Algorithm</h3>
            <p className="text-muted-foreground">
              NFT-verified listings appear FIRST. Proof images, bounties, and
              escrow boost visibility automatically.
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Built on Base</h3>
            <p className="text-muted-foreground">
              Low fees, fast transactions, and Ethereum security. The perfect L2
              for real-world blockchain applications.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">$68B</div>
              <div className="text-sm text-muted-foreground">
                Lost items annually
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-accent">3B+</div>
              <div className="text-sm text-muted-foreground">
                Smartphone users
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-chart-3">100%</div>
              <div className="text-sm text-muted-foreground">Decentralized</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-chart-4">0%</div>
              <div className="text-sm text-muted-foreground">
                Platform fees (Phase 1)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Register your devices now and join the future of lost and found
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Register Your First Device
              <Shield className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
