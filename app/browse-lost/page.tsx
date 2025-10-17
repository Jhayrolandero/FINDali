"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Shield,
  MapPin,
  Clock,
  Coins,
  MessageSquare,
  Filter,
  Flag,
  Upload,
  Loader2,
  Twitter,
  Send,
  Facebook,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFoundListings } from "@/lib/hooks/useFoundListingOperations";
import { useBounties } from "@/lib/hooks/useBounties";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "@/lib/contract";
import { uploadClaimToIPFS } from "@/lib/api/ipfs";

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
  const [useBlockchain, setUseBlockchain] = useState(true);
  const { listings, loading: listingsLoading } = useFoundListings();
  const { bounties, loading: bountiesLoading } = useBounties();
  const { address, isConnected } = useAccount();

  // Report Found Modal State
  const [selectedBounty, setSelectedBounty] = useState<any>(null);
  const [reportFoundDialog, setReportFoundDialog] = useState(false);
  const [claimDescription, setClaimDescription] = useState("");
  const [claimImage, setClaimImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingClaim, setUploadingClaim] = useState(false);
  const [claimError, setClaimError] = useState("");
  const { writeContractAsync } = useWriteContract();

  // Contact Modal State
  const [contactDialog, setContactDialog] = useState(false);
  const [contactBounty, setContactBounty] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClaimImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitClaim = async () => {
    if (!claimImage || !claimDescription || !selectedBounty) {
      setClaimError("Please provide both an image and description");
      return;
    }

    setUploadingClaim(true);
    setClaimError("");

    try {
      // Upload to IPFS
      const ipfsHash = await uploadClaimToIPFS(claimImage, claimDescription);

      // Submit claim to smart contract
      if (selectedBounty.isNFTVerified) {
        // NFT bounty - use submitClaim
        await writeContractAsync({
          address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
          abi: FINDCHAIN_ABI,
          functionName: "submitClaim",
          args: [BigInt(selectedBounty.id), ipfsHash],
        });
      } else {
        // Open bounty - use submitOpenClaim
        await writeContractAsync({
          address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
          abi: FINDCHAIN_ABI,
          functionName: "submitOpenClaim",
          args: [BigInt(selectedBounty.id), ipfsHash],
        });
      }

      // Reset form and close dialog
      setReportFoundDialog(false);
      setClaimDescription("");
      setClaimImage(null);
      setImagePreview(null);
      setSelectedBounty(null);
    } catch (err: any) {
      console.error("Error submitting claim:", err);
      setClaimError(err?.message || "Failed to submit claim");
    } finally {
      setUploadingClaim(false);
    }
  };

  // Mock social media data for randomization
  const socialMediaProfiles = [
    {
      twitter: "@finder_manila",
      telegram: "@finderph",
      facebook: "finder.manila",
    },
    {
      twitter: "@helpph2024",
      telegram: "@helpfinder",
      facebook: "helpfinder.ph",
    },
    {
      telegram: "@lostfoundph",
      facebook: "lostfound.manila",
    },
    {
      twitter: "@returndevice",
      facebook: "returndevice.ph",
    },
  ];

  const getRandomSocialMedia = (seed: number) => {
    const index = seed % socialMediaProfiles.length;
    return socialMediaProfiles[index];
  };

  // Merge bounties and found listings - filter out claimed items
  const mergedListings = useBlockchain
    ? [
        ...bounties
          .filter((bounty) => bounty.active) // Only show active bounties
          .map((bounty) => ({
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
        ...listings
          .filter((listing) => !listing.claimed) // Only show unclaimed listings
          .map((listing) => ({
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
    : mockLostDevices.filter((device) => !device.claimed); // Only show unclaimed devices

  const displayedListings = mergedListings;
  const loading = listingsLoading || bountiesLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-4xl font-bold">Browse Lost Devices</h1>
          <p className="text-lg text-muted-foreground">
            Help reunite owners with their devices. NFT-verified listings appear
            first.
          </p>
          {/* <Button className="mt-4" onClick={() => setUseBlockchain((v) => !v)}>
            {useBlockchain ? "Show Mock Data" : "Show Blockchain Records"}
          </Button> */}
        </div>

        {/* Search and Filters */}
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-4 md:flex-row">
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
        <div className="mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {useBlockchain && loading ? (
              <div className="col-span-full">Loading...</div>
            ) : displayedListings.length === 0 ? (
              <Card className="col-span-full border-border bg-card p-12 text-center">
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
                    className="border-border gap-2 bg-card overflow-hidden transition-all hover:border-primary/50 py-1"
                  >
                    {/* Minimalistic Header */}
                    <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                      <Link
                        href={`/user-profile/${listing.finder}`}
                        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                          {listing.finder.slice(2, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                              Owner
                            </span>
                            {listing.isNFTVerified && (
                              <Shield className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              listing.submittedAt * 1000
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>

                      {listing.rewardAmount !== "0" && (
                        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-accent">
                          <Coins className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">
                            {listing.rewardAmount} ETH
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Device Image with proper aspect ratio */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10">
                      <img
                        src="https://powermaccenter.com/cdn/shop/files/iPhone_16_Plus_Pink_PDP_Image_Position_1__en-WW.jpg?v=1726236857&width=823"
                        alt={listing.deviceDescription}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {listing.deviceDescription}
                        </h3>
                        {listing.isNFTVerified && (
                          <Shield className="size-4 text-blue-500" />
                        )}
                      </div>

                      {listing.location && (
                        <div className="mb-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{listing.location}</span>
                        </div>
                      )}

                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {listing.details || listing.proofHash}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {/* Contact Button - opens social media dialog */}
                        <Dialog
                          open={contactDialog && contactBounty?.id === listing.id}
                          onOpenChange={(open) => {
                            setContactDialog(open);
                            if (!open) setContactBounty(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="h-9 flex-1 gap-1.5 bg-primary text-sm text-primary-foreground hover:bg-primary/90"
                              onClick={() => setContactBounty(listing)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              Contact
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Contact Owner</DialogTitle>
                              <DialogDescription>
                                Connect with the device owner through social media
                              </DialogDescription>
                            </DialogHeader>
                            {contactBounty && (() => {
                              const social = getRandomSocialMedia(contactBounty.id);
                              return (
                                <div className="space-y-3">
                                  {social.twitter && (
                                    <a
                                      href={`https://twitter.com/${social.twitter.replace("@", "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    >
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                        <Twitter className="h-5 w-5 text-blue-500" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Twitter</p>
                                        <p className="text-sm font-medium">{social.twitter}</p>
                                      </div>
                                    </a>
                                  )}
                                  {social.telegram && (
                                    <a
                                      href={`https://t.me/${social.telegram.replace("@", "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    >
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/10">
                                        <Send className="h-5 w-5 text-blue-400" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Telegram</p>
                                        <p className="text-sm font-medium">{social.telegram}</p>
                                      </div>
                                    </a>
                                  )}
                                  {social.facebook && (
                                    <a
                                      href={`https://facebook.com/${social.facebook}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    >
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
                                        <Facebook className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Facebook</p>
                                        <p className="text-sm font-medium">{social.facebook}</p>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              );
                            })()}
                          </DialogContent>
                        </Dialog>

                        {/* Report Found Button - only show if not the owner */}
                        {isConnected && address?.toLowerCase() !== listing.finder.toLowerCase() && (
                          <Dialog
                            open={reportFoundDialog && selectedBounty?.id === listing.id}
                            onOpenChange={(open) => {
                              setReportFoundDialog(open);
                              if (!open) {
                                setSelectedBounty(null);
                                setClaimDescription("");
                                setClaimImage(null);
                                setImagePreview(null);
                                setClaimError("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 flex-1 gap-1.5 text-sm border-accent text-accent hover:bg-accent/10"
                                onClick={() => setSelectedBounty(listing)}
                              >
                                <Flag className="h-4 w-4" />
                                Report Found
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Report Found Device</DialogTitle>
                                <DialogDescription>
                                  Submit proof that you found this device
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                  <Label htmlFor="claim-image">Upload Proof Image</Label>
                                  <div className="mt-2">
                                    {imagePreview ? (
                                      <div className="relative">
                                        <img
                                          src={imagePreview}
                                          alt="Preview"
                                          className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="absolute top-2 right-2"
                                          onClick={() => {
                                            setClaimImage(null);
                                            setImagePreview(null);
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    ) : (
                                      <label
                                        htmlFor="claim-image"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                                      >
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">
                                          Click to upload image
                                        </span>
                                        <input
                                          id="claim-image"
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={handleImageChange}
                                        />
                                      </label>
                                    )}
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <Label htmlFor="claim-description">Description</Label>
                                  <Textarea
                                    id="claim-description"
                                    placeholder="Describe where and how you found the device..."
                                    value={claimDescription}
                                    onChange={(e) => setClaimDescription(e.target.value)}
                                    className="mt-2 min-h-[100px]"
                                  />
                                </div>

                                {/* Error Message */}
                                {claimError && (
                                  <div className="text-sm text-destructive">{claimError}</div>
                                )}

                                {/* Submit Button */}
                                <Button
                                  onClick={handleSubmitClaim}
                                  disabled={uploadingClaim || !claimImage || !claimDescription}
                                  className="w-full"
                                >
                                  {uploadingClaim ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting Claim...
                                    </>
                                  ) : (
                                    <>
                                      <Flag className="mr-2 h-4 w-4" />
                                      Submit Claim
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
