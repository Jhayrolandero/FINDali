"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Package,
  ExternalLink,
  Eye,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserDevicesWithMetadata } from "@/lib/hooks/useUserDevicesWithMetadata";
import { useAccount } from "wagmi";
import type { DeviceMetadata } from "@/lib/api/types";

export default function MyDevicesPage() {
  const { address, isConnected } = useAccount();
  const { devices, totalCount, isLoading, error, refetch } = useUserDevicesWithMetadata(address);

  const [selectedDevice, setSelectedDevice] = useState<DeviceMetadata | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // For now, all devices are registered. In the future, integrate bounty status
  const getStatusConfig = () => {
    return {
      label: "Registered",
      color: "bg-accent text-accent-foreground",
      icon: CheckCircle2,
    };
  };

  // Show wallet connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md border-border bg-card p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to view your registered devices
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-border bg-card p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Loading Your Devices</h3>
            <p className="text-muted-foreground">
              Fetching your NFT-verified devices from the blockchain...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md border-destructive bg-card p-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold">Error Loading Devices</h2>
            <p className="mb-4 text-center text-muted-foreground">{error.message}</p>
            <Button onClick={refetch} className="w-full">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-4xl font-bold">My Devices</h1>
            <p className="text-lg text-muted-foreground">
              Manage your NFT-verified devices
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refetch} variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Refresh
            </Button>
            <Link href="/register">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Package className="h-4 w-4" />
                Register New Device
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-3xl font-bold">{totalCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Device Brands</p>
                <p className="text-3xl font-bold">
                  {new Set(devices.map(d => d.brand)).size}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bounties</p>
                <p className="text-3xl font-bold">0 ETH</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Devices List */}
        <div className="space-y-4">
          {devices.map((device) => {
            const statusConfig = getStatusConfig();
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={device.tokenId} className="border-border bg-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row">
                  {/* Device Icon/Image Placeholder */}
                  <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 lg:h-auto lg:w-32">
                    <Package className="h-16 w-16 text-primary" />
                  </div>

                  {/* Device Info */}
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-bold">
                            {device.brand} {device.modelName}
                          </h3>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Shield className="h-3 w-3" />
                            NFT #{device.tokenId}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Model: {device.model}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Brand:</span>{" "}
                        <span className="font-semibold">{device.brand}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Model Number:</span>{" "}
                        <span className="font-semibold font-mono text-xs">{device.model}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Registered:
                        </span>{" "}
                        <span className="font-semibold">
                          {formatDate(device.mintedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Block Number:
                        </span>{" "}
                        <span className="font-semibold font-mono text-xs">
                          {device.mintBlock}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="destructive" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Report Lost
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 bg-transparent"
                            onClick={() => setSelectedDevice(device)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {device.brand} {device.modelName}
                            </DialogTitle>
                            <DialogDescription>
                              NFT Token #{device.tokenId}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedDevice && (
                            <div className="space-y-4">
                              <div className="grid gap-3 text-sm">
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Token ID
                                  </span>
                                  <span className="font-mono font-bold">
                                    #{selectedDevice.tokenId}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Full Model Name
                                  </span>
                                  <span className="font-semibold">
                                    {selectedDevice.modelName}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Model Number
                                  </span>
                                  <span className="font-mono text-xs">
                                    {selectedDevice.model}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Minted At
                                  </span>
                                  <span className="font-semibold">
                                    {formatDate(selectedDevice.mintedAt)}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Block Number
                                  </span>
                                  <span className="font-mono text-xs">
                                    {selectedDevice.mintBlock}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-secondary p-3">
                                  <span className="text-muted-foreground">
                                    Blockchain
                                  </span>
                                  <span className="font-semibold">
                                    Base Sepolia (Testnet)
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 gap-2 bg-transparent"
                                  variant="outline"
                                  onClick={() => window.open(`https://sepolia.basescan.org/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${selectedDevice.tokenId}`, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View on BaseScan
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {devices.length === 0 && (
          <Card className="border-border bg-card p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              No devices registered yet
            </h3>
            <p className="mb-4 text-muted-foreground">
              Start by registering your first device as an NFT
            </p>
            <Link href="/register">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Package className="h-4 w-4" />
                Register Your First Device
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

