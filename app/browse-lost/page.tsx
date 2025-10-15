"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Shield,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for lost devices
const mockLostDevices = [
  {
    id: 1,
    brand: "Apple",
    model: "iPhone 15 Pro",
    category: "Phone",
    bounty: 0.5,
    hasEscrow: true,
    isNFTVerified: true,
    hasProof: true,
    location: "San Francisco, CA",
    reportedDate: "2 days ago",
    ownerAddress: "0x1234...5678",
    ownerENS: "alice.eth",
    reputation: 85,
    description:
      "Lost at Golden Gate Park near the Japanese Tea Garden. Black titanium with clear case.",
    proofImages: 3,
  },
  {
    id: 2,
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    category: "Phone",
    bounty: 0.3,
    hasEscrow: true,
    isNFTVerified: true,
    hasProof: true,
    location: "New York, NY",
    reportedDate: "5 hours ago",
    ownerAddress: "0xabcd...efgh",
    ownerENS: null,
    reputation: 72,
    description:
      "Lost in subway station. Phantom Black color with screen protector.",
    proofImages: 2,
  },
  {
    id: 3,
    brand: "Apple",
    model: 'MacBook Pro 16"',
    category: "Laptop",
    bounty: 1.2,
    hasEscrow: true,
    isNFTVerified: true,
    hasProof: true,
    location: "Austin, TX",
    reportedDate: "1 day ago",
    ownerAddress: "0x9876...4321",
    ownerENS: "bob.eth",
    reputation: 95,
    description:
      "Space Gray MacBook Pro with stickers. Left at coffee shop on 6th Street.",
    proofImages: 4,
  },
  {
    id: 4,
    brand: "Sony",
    model: "A7 IV Camera",
    category: "Camera",
    bounty: 0.8,
    hasEscrow: false,
    isNFTVerified: false,
    hasProof: false,
    location: "Los Angeles, CA",
    reportedDate: "3 days ago",
    ownerAddress: "0xdef0...1234",
    ownerENS: null,
    reputation: 45,
    description: "Professional camera with 24-70mm lens. Lost at Venice Beach.",
    proofImages: 0,
  },
  {
    id: 5,
    brand: "Apple",
    model: 'iPad Pro 12.9"',
    category: "Tablet",
    bounty: 0.4,
    hasEscrow: true,
    isNFTVerified: true,
    hasProof: true,
    location: "Seattle, WA",
    reportedDate: "12 hours ago",
    ownerAddress: "0x5555...6666",
    ownerENS: "charlie.eth",
    reputation: 88,
    description:
      "Silver iPad Pro with Magic Keyboard. Lost at airport terminal.",
    proofImages: 3,
  },
];

export default function BrowseLostPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");

  const getTrustLevel = (reputation: number) => {
    if (reputation >= 80)
      return { label: "Trusted", color: "bg-accent text-accent-foreground" };
    if (reputation >= 50)
      return { label: "Verified", color: "bg-primary text-primary-foreground" };
    if (reputation >= 20)
      return { label: "New", color: "bg-secondary text-secondary-foreground" };
    return { label: "Unverified", color: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Browse Lost Devices</h1>
          <p className="text-lg text-muted-foreground">
            Help reunite owners with their devices. NFT-verified listings appear
            first.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by brand, model, or IMEI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="camera">Camera</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority (Default)</SelectItem>
              <SelectItem value="bounty">Highest Bounty</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="reputation">Owner Reputation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {mockLostDevices.length} lost devices
        </div>

        {/* Device Listings */}
        <div className="grid gap-6">
          {mockLostDevices.map((device) => {
            const trustLevel = getTrustLevel(device.reputation);
            return (
              <Card
                key={device.id}
                className="border-border bg-card p-6 transition-all hover:border-primary/50"
              >
                <div className="flex flex-col gap-4 lg:flex-row">
                  {/* Device Image Placeholder */}
                  <div className="flex h-48 w-full items-center justify-center rounded-lg bg-secondary lg:h-auto lg:w-48">
                    <img
                      src={`/.jpg?height=200&width=200&query=${device.brand} ${device.model}`}
                      alt={`${device.brand} ${device.model}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>

                  {/* Device Details */}
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-bold">
                            {device.brand} {device.model}
                          </h3>
                          {device.isNFTVerified && (
                            <Badge className="gap-1 bg-primary text-primary-foreground">
                              <Shield className="h-3 w-3" />
                              NFT Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {device.reportedDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 flex items-center gap-2 text-2xl font-bold text-accent">
                          <DollarSign className="h-6 w-6" />
                          {device.bounty} ETH
                        </div>
                        {device.hasEscrow && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-accent/50 text-accent"
                          >
                            Escrow Protected
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="mb-4 text-muted-foreground">
                      {device.description}
                    </p>

                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Owner:
                        </span>
                        <span className="font-mono text-sm">
                          {device.ownerENS || device.ownerAddress}
                        </span>
                        <Badge className={trustLevel.color}>
                          {trustLevel.label}
                        </Badge>
                      </div>
                      {device.hasProof && (
                        <Badge variant="outline" className="gap-1">
                          <Shield className="h-3 w-3" />
                          {device.proofImages} Proof Images
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        <MessageSquare className="h-4 w-4" />
                        Contact Owner
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State (hidden when there are results) */}
        {mockLostDevices.length === 0 && (
          <Card className="border-border bg-card p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No devices found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
