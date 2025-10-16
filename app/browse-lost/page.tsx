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
import { useFoundListings } from "@/lib/hooks/useFoundListingOperations";
import { useBounties } from "@/lib/hooks/useBounties";

const mockLostDevices = [
  {
    id: 1,
    deviceDescription: "Black iPhone 13 found at Central Park",
    proofHash: "QmProofHash123",
    finder: "0x1234...abcd",
    submittedAt: 1697400000,
    claimed: false,
    claimedBy: "",
    rewardAmount: "0.1",
    location: "Central Park",
    details: "Near the fountain",
    isNFTVerified: false,
  },
  {
    id: 2,
    deviceDescription: "Samsung Galaxy S22 lost in subway",
    proofHash: "QmProofHash456",
    finder: "0x5678...efgh",
    submittedAt: 1697401000,
    claimed: true,
    claimedBy: "0x9999...8888",
    rewardAmount: "0.2",
    location: "Subway Station",
    details: "Line 2",
    isNFTVerified: false,
  },
];

export default function BrowseLostPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [useBlockchain, setUseBlockchain] = useState(false);
  const { listings, loading: listingsLoading } = useFoundListings();
  const { bounties, loading: bountiesLoading } = useBounties();

  // Merge bounties and found listings
  const mergedListings = useBlockchain
    ? [
        ...bounties.map((bounty) => ({
          id: bounty.tokenId,
          deviceDescription: bounty.deviceInfo
            ? `${bounty.deviceInfo.brand} ${bounty.deviceInfo.modelName}`
            : `NFT Device #${bounty.tokenId}`,
          proofHash: bounty.details,
          finder: bounty.owner,
          submittedAt: bounty.createdAt,
          claimed: !bounty.active,
          claimedBy: "",
          rewardAmount: bounty.amount,
          location: bounty.location,
          details: bounty.details,
          isNFTVerified: true,
        })),
        ...listings.map((listing) => ({
          id: listing.id,
          deviceDescription: listing.deviceDescription,
          proofHash: listing.proofHash,
          finder: listing.finder,
          submittedAt: listing.submittedAt,
          claimed: listing.claimed,
          claimedBy: listing.claimedBy,
          rewardAmount: listing.rewardAmount,
          location: "",
          details: listing.proofHash,
          isNFTVerified: false,
        })),
      ].sort((a, b) => (b.isNFTVerified ? 1 : 0) - (a.isNFTVerified ? 1 : 0)) // NFT-verified first
    : mockLostDevices;

  const displayedListings = mergedListings;
  const loading = listingsLoading || bountiesLoading;

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
          <Button className="mt-4" onClick={() => setUseBlockchain((v) => !v)}>
            {useBlockchain ? "Show Mock Data" : "Show Blockchain Records"}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by description, finder, or proof..."
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
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Device Listings (mock or blockchain) */}
        <div className="grid gap-6">
          {useBlockchain && loading ? (
            <div>Loading...</div>
          ) : displayedListings.length === 0 ? (
            <Card className="border-border bg-card p-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No devices found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </Card>
          ) : (
            displayedListings
              .filter(
                (listing) =>
                  listing.deviceDescription
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  listing.finder
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  listing.proofHash
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((listing) => (
                <Card
                  key={listing.id}
                  className="border-border bg-card p-6 transition-all hover:border-primary/50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Device Details */}
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-bold">
                              {listing.deviceDescription}
                            </h3>
                            {listing.isNFTVerified && (
                              <Badge className="gap-1 bg-blue-600 text-white">
                                <Shield className="h-3 w-3" />
                                NFT Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {listing.location || "Location not specified"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {listing.rewardAmount !== "0" && (
                            <div className="mb-1 flex items-center gap-2 text-2xl font-bold text-accent">
                              <DollarSign className="h-6 w-6" />
                              {listing.rewardAmount} ETH
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mb-4 text-muted-foreground">
                        <strong>Details:</strong>{" "}
                        {listing.details || listing.proofHash}
                      </div>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="gap-1">
                          Claimed: {listing.claimed ? "Yes" : "No"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Owner: {listing.finder.slice(0, 6)}...
                          {listing.finder.slice(-4)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                          <MessageSquare className="h-4 w-4" />
                          Contact Finder
                        </Button>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
