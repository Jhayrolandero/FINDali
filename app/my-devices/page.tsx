"use client";

import { useState, useEffect } from "react";
import { useWriteContract } from "wagmi";
import { FINDCHAIN_CONTRACT_ADDRESS, FINDCHAIN_ABI } from "@/lib/contract";
import { parseEther } from "viem";
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
  User,
  FileText,
  Image as ImageIcon,
  Clock,
  XCircle,
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
import { useDeviceBounties } from "@/lib/hooks/useDeviceBounties";
import { useUserBountyClaims } from "@/lib/hooks/useBountyClaims";
import { useAccount } from "wagmi";
import type { DeviceMetadata } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { fetchClaimFromIPFS } from "@/lib/api/ipfs";

export default function MyDevicesPage() {
  const { address, isConnected } = useAccount();
  const { devices, totalCount, isLoading, error, refetch } =
    useUserDevicesWithMetadata(address);

  // Get bounty statuses for all devices
  const tokenIds = devices.map((d) => d.tokenId);
  const { bountyStatuses, isLoading: bountiesLoading } =
    useDeviceBounties(tokenIds);

  // Get claims for all bounties - explicitly convert to number array
  const activeBountyTokenIds = tokenIds
    .filter((id) => bountyStatuses[id]?.hasActiveBounty)
    .map((id) => Number(id)) as number[];
  const { claimsByToken, loading: claimsLoading } =
    useUserBountyClaims(activeBountyTokenIds);

  const [claimData, setClaimData] = useState<
    Record<
      number,
      {
        image: string;
        imageUrl: string;
        description: string;
        timestamp: number;
      }
    >
  >({});

  // Fetch IPFS data for claims
  useEffect(() => {
    async function fetchClaimData() {
      const newClaimData: typeof claimData = {};

      for (const tokenIdStr in claimsByToken) {
        const tokenId = Number(tokenIdStr);
        const claims = claimsByToken[tokenId];
        if (!claims) continue;
        
        for (const claim of claims) {
          try {
            const data = await fetchClaimFromIPFS(claim.proofHash);
            newClaimData[claim.claimId] = data;
          } catch (err) {
            console.error(
              `Error fetching claim data for claim ${claim.claimId}:`,
              err
            );
          }
        }
      }

      setClaimData(newClaimData);
    }

    if (Object.keys(claimsByToken).length > 0) {
      fetchClaimData();
    }
  }, [claimsByToken]);

  const [selectedDevice, setSelectedDevice] = useState<DeviceMetadata | null>(
    null
  );
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportLocation, setReportLocation] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportBounty, setReportBounty] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [confirmingClaim, setConfirmingClaim] = useState<number | null>(null);
  const [rejectingClaim, setRejectingClaim] = useState<number | null>(null);
  const { writeContractAsync } = useWriteContract();

  const handleConfirmClaim = async (claimId: number) => {
    setConfirmingClaim(claimId);
    try {
      await writeContractAsync({
        address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: FINDCHAIN_ABI,
        functionName: "confirmClaim",
        args: [BigInt(claimId)],
      });
      // Refresh data
      refetch();
    } catch (err: any) {
      console.error("Error confirming claim:", err);
      alert(err?.message || "Failed to confirm claim");
    } finally {
      setConfirmingClaim(null);
    }
  };

  const handleRejectClaim = async (claimId: number) => {
    setRejectingClaim(claimId);
    try {
      await writeContractAsync({
        address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: FINDCHAIN_ABI,
        functionName: "rejectClaim",
        args: [BigInt(claimId)],
      });
      // Refresh data
      refetch();
    } catch (err: any) {
      console.error("Error rejecting claim:", err);
      alert(err?.message || "Failed to reject claim");
    } finally {
      setRejectingClaim(null);
    }
  };

  const handleReportLost = async () => {
    setReportLoading(true);
    setReportError("");
    setReportSuccess(false);
    const bountyValue = parseFloat(reportBounty);
    const minBounty = 0.000005;
    if (isNaN(bountyValue) || bountyValue < minBounty || bountyValue > 10) {
      setReportError("Bounty must be between 0.000005 and 10 ETH");
      setReportLoading(false);
      return;
    }
    try {
      const tokenIdBigInt = selectedDevice ? BigInt(selectedDevice.tokenId) : BigInt(0);
      await writeContractAsync({
        address: FINDCHAIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: FINDCHAIN_ABI,
        functionName: "createBounty",
        args: [
          tokenIdBigInt,
          reportLocation,
          reportDetails,
        ],
        value: parseEther(reportBounty),
      });
      setReportSuccess(true);
      setShowReportDialog(false);
    } catch (err: any) {
      setReportError(err?.message || "Failed to report lost device");
    }
    setReportLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <h2 className="mb-2 text-center text-2xl font-bold">
              Error Loading Devices
            </h2>
            <p className="mb-4 text-center text-muted-foreground">
              {error.message}
            </p>
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
                  {new Set(devices.map((d) => d.brand)).size}
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
                <p className="text-3xl font-bold">
                  {bountiesLoading
                    ? "..."
                    : Object.values(bountyStatuses)
                        .filter((b) => b.hasActiveBounty)
                        .reduce((sum, b) => sum + parseFloat(b.amount), 0)
                        .toFixed(4)}{" "}
                  ETH
                </p>
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
                        <span className="text-muted-foreground">
                          Model Number:
                        </span>{" "}
                        <span className="font-semibold font-mono text-xs">
                          {device.model}
                        </span>
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

                    {/* Claims Section - only show if there are claims */}
                    {bountyStatuses[device.tokenId]?.hasActiveBounty &&
                      claimsByToken[Number(device.tokenId)]?.length > 0 && (
                        <div className="mt-4 border-t border-border pt-4">
                          <h4 className="mb-3 text-sm font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            Claims Submitted ({claimsByToken[Number(device.tokenId)]?.length || 0})
                          </h4>
                          <div className="space-y-3">
                            {claimsByToken[Number(device.tokenId)]?.map((claim: any) => {
                              const data = claimData[claim.claimId];
                              return (
                                <Card
                                  key={claim.claimId}
                                  className="border-border bg-secondary/20 p-4"
                                >
                                  <div className="flex flex-col gap-3">
                                    {/* Claim Header */}
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                                          {claim.finder.slice(2, 4).toUpperCase()}
                                        </div>
                                        <div>
                                          <Link
                                            href={`/user-profile/${claim.finder}`}
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                          >
                                            {claim.finder.slice(0, 6)}...
                                            {claim.finder.slice(-4)}
                                          </Link>
                                          <p className="text-xs text-muted-foreground">
                                            {new Date(
                                              claim.submittedAt * 1000
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                      {claim.confirmed && (
                                        <Badge className="bg-accent text-accent-foreground">
                                          <CheckCircle2 className="mr-1 h-3 w-3" />
                                          Confirmed
                                        </Badge>
                                      )}
                                      {claim.rejected && (
                                        <Badge variant="destructive">
                                          <XCircle className="mr-1 h-3 w-3" />
                                          Rejected
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Claim Content */}
                                    {data ? (
                                      <div className="space-y-2">
                                        {/* Image */}
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                          <img
                                            src={data.imageUrl}
                                            alt="Claim proof"
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        {/* Description */}
                                        <div>
                                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                                            Description
                                          </p>
                                          <p className="text-sm">{data.description}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading claim data...
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    {!claim.confirmed && !claim.rejected && (
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="flex-1 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                                          onClick={() =>
                                            handleConfirmClaim(claim.claimId)
                                          }
                                          disabled={confirmingClaim === claim.claimId}
                                        >
                                          {confirmingClaim === claim.claimId ? (
                                            <>
                                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              Confirming...
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle2 className="h-3.5 w-3.5" />
                                              Confirm & Pay
                                            </>
                                          )}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-1 gap-1.5"
                                          onClick={() =>
                                            handleRejectClaim(claim.claimId)
                                          }
                                          disabled={rejectingClaim === claim.claimId}
                                        >
                                          {rejectingClaim === claim.claimId ? (
                                            <>
                                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              Rejecting...
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="h-3.5 w-3.5" />
                                              Reject
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    <div className="flex flex-wrap gap-3">
                      {bountyStatuses[device.tokenId]?.hasActiveBounty ? (
                        <Button
                          variant="outline"
                          className="gap-2 border-primary/50 bg-primary/10 text-primary cursor-not-allowed"
                          disabled
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Reported ({bountyStatuses[device.tokenId].amount} ETH)
                        </Button>
                      ) : (
                        <Dialog
                          open={showReportDialog}
                          onOpenChange={setShowReportDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="gap-2"
                              onClick={() => {
                                setSelectedDevice(device);
                                setShowReportDialog(true);
                              }}
                            >
                              <AlertCircle className="h-4 w-4" />
                              Report Lost
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Report Lost Device</DialogTitle>
                              <DialogDescription>
                                NFT Token #{device.tokenId} ({device.brand}{" "}
                                {device.modelName})
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleReportLost();
                              }}
                              className="space-y-4"
                            >
                              <Input
                                placeholder="Last Known Location"
                                value={reportLocation}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => setReportLocation(e.target.value)}
                                required
                              />
                              <Input
                                placeholder="Details (IMEI, color, notes...)"
                                value={reportDetails}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => setReportDetails(e.target.value)}
                                required
                              />
                              <Input
                                type="number"
                                step="0.0001"
                                min="0.000005"
                                max="10"
                                placeholder="Bounty (ETH, 0.000005 - 10)"
                                value={reportBounty}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => setReportBounty(e.target.value)}
                                required
                              />
                              <Button
                                type="submit"
                                disabled={reportLoading}
                                className="w-full"
                              >
                                {reportLoading
                                  ? "Submitting..."
                                  : "Report & Lock Bounty"}
                              </Button>
                              {reportError && (
                                <div className="text-red-500 text-sm">
                                  {reportError}
                                </div>
                              )}
                              {reportSuccess && (
                                <div className="text-green-600 text-sm">
                                  Device reported successfully!
                                </div>
                              )}
                            </form>
                          </DialogContent>
                        </Dialog>
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
                              {device.brand} {device.modelName}
                            </DialogTitle>
                            <DialogDescription>
                              NFT Token #{device.tokenId}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedDevice && (
                            <div className="space-y-4">
                              <div className="grid gap-3 text-sm">
                                <div className="flex justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                                  <span className="text-muted-foreground">
                                    Token ID
                                  </span>
                                  <span className="font-mono font-bold text-primary">
                                    #{selectedDevice.tokenId}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg border border-accent/30 bg-accent/5 p-3">
                                  <span className="text-muted-foreground">
                                    Full Model Name
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    {selectedDevice.modelName}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                                  <span className="text-muted-foreground">
                                    Model Number
                                  </span>
                                  <span className="font-mono text-xs text-foreground">
                                    {selectedDevice.model}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                                  <span className="text-muted-foreground">
                                    Minted At
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    {formatDate(selectedDevice.mintedAt)}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg border border-accent/30 bg-accent/5 p-3">
                                  <span className="text-muted-foreground">
                                    Block Number
                                  </span>
                                  <span className="font-mono text-xs text-foreground">
                                    {selectedDevice.mintBlock}
                                  </span>
                                </div>
                                <div className="flex justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                                  <span className="text-muted-foreground">
                                    Blockchain
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    Base Sepolia (Testnet)
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 gap-2 bg-transparent"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(
                                      `https://sepolia.basescan.org/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${selectedDevice.tokenId}`,
                                      "_blank"
                                    )
                                  }
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
