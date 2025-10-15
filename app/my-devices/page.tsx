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

// Mock data for user's devices
const mockDevices = [
  {
    id: 1,
    tokenId: "#12847",
    brand: "Apple",
    model: "iPhone 15 Pro",
    category: "Phone",
    color: "Natural Titanium",
    status: "registered",
    registeredDate: "2024-10-10",
    imeiHash: "0x9b4c...8f1a",
    txHash: "0x7a8f...3d2e",
    proofImages: 3,
    description: "Main phone with clear case",
  },
  {
    id: 2,
    tokenId: "#11203",
    brand: "Apple",
    model: 'MacBook Pro 16"',
    category: "Laptop",
    color: "Space Gray",
    status: "lost",
    registeredDate: "2024-09-15",
    lostDate: "2024-10-12",
    bounty: 1.2,
    hasEscrow: true,
    imeiHash: "0x3f7d...2c9b",
    txHash: "0x4b2e...9f3a",
    proofImages: 4,
    description: "Work laptop with company stickers",
    lastLocation: "Coffee shop on 6th Street, Austin",
  },
  {
    id: 3,
    tokenId: "#10584",
    brand: "Samsung",
    model: "Galaxy Watch 6",
    category: "Other",
    color: "Graphite",
    status: "registered",
    registeredDate: "2024-08-20",
    imeiHash: "0x8e2a...5d7f",
    txHash: "0x1c9d...4e8b",
    proofImages: 2,
    description: "Fitness tracking watch",
  },
];

export default function MyDevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<
    (typeof mockDevices)[0] | null
  >(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "registered":
        return {
          label: "Registered",
          color: "bg-accent text-accent-foreground",
          icon: CheckCircle2,
        };
      case "lost":
        return {
          label: "Lost - Active",
          color: "bg-destructive text-destructive-foreground",
          icon: AlertCircle,
        };
      case "found":
        return {
          label: "Found",
          color: "bg-primary text-primary-foreground",
          icon: CheckCircle2,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-muted text-muted-foreground",
          icon: Package,
        };
    }
  };

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
          <Link href="/register">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Package className="h-4 w-4" />
              Register New Device
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-3xl font-bold">{mockDevices.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lost Devices</p>
                <p className="text-3xl font-bold">
                  {mockDevices.filter((d) => d.status === "lost").length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bounties</p>
                <p className="text-3xl font-bold">
                  {mockDevices
                    .filter((d) => d.status === "lost" && d.bounty)
                    .reduce((sum, d) => sum + (d.bounty || 0), 0)
                    .toFixed(1)}{" "}
                  ETH
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Devices List */}
        <div className="space-y-4">
          {mockDevices.map((device) => {
            const statusConfig = getStatusConfig(device.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={device.id} className="border-border bg-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row">
                  {/* Device Image */}
                  <div className="flex h-32 w-full items-center justify-center rounded-lg bg-secondary lg:h-auto lg:w-32">
                    <img
                      src={`/.jpg?height=150&width=150&query=${device.brand} ${device.model}`}
                      alt={`${device.brand} ${device.model}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>

                  {/* Device Info */}
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-bold">
                            {device.brand} {device.model}
                          </h3>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Shield className="h-3 w-3" />
                            NFT {device.tokenId}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {device.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        <span className="font-semibold">{device.category}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Color:</span>{" "}
                        <span className="font-semibold">{device.color}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Registered:
                        </span>{" "}
                        <span className="font-semibold">
                          {device.registeredDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Proof Images:
                        </span>{" "}
                        <span className="font-semibold">
                          {device.proofImages}
                        </span>
                      </div>
                      {device.status === "lost" && device.bounty && (
                        <>
                          <div>
                            <span className="text-muted-foreground">
                              Bounty:
                            </span>{" "}
                            <span className="font-semibold text-accent">
                              {device.bounty} ETH
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Last Seen:
                            </span>{" "}
                            <span className="font-semibold">
                              {device.lastLocation}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {device.status === "registered" && (
                        <Button variant="destructive" className="gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Report Lost
                        </Button>
                      )}
                      {device.status === "lost" && (
                        <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                          <Edit className="h-4 w-4" />
                          Edit Listing
                        </Button>
                      )}
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
                              {device.brand} {device.model}
                            </DialogTitle>
                            <DialogDescription>
                              NFT Token {device.tokenId}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-3 text-sm">
                              <div className="flex justify-between rounded-lg bg-secondary p-3">
                                <span className="text-muted-foreground">
                                  IMEI Hash
                                </span>
                                <span className="font-mono">
                                  {device.imeiHash}
                                </span>
                              </div>
                              <div className="flex justify-between rounded-lg bg-secondary p-3">
                                <span className="text-muted-foreground">
                                  Transaction Hash
                                </span>
                                <span className="font-mono">
                                  {device.txHash}
                                </span>
                              </div>
                              <div className="flex justify-between rounded-lg bg-secondary p-3">
                                <span className="text-muted-foreground">
                                  Blockchain
                                </span>
                                <span className="font-semibold">
                                  Base (Ethereum L2)
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 gap-2 bg-transparent"
                                variant="outline"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View on BaseScan
                              </Button>
                              <Button
                                className="flex-1 gap-2 bg-transparent"
                                variant="outline"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View on OpenSea
                              </Button>
                            </div>
                          </div>
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
        {mockDevices.length === 0 && (
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
