"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Upload, X, Info, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { useMintDevice, useCheckIMEI } from "@/lib/hooks";
import { validateIMEI, createProofHash, getBlockExplorerUrl } from "@/lib/helpers";

export default function RegisterDevicePage() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Form data
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [imei, setImei] = useState("");
  const [description, setDescription] = useState("");
  const [imeiError, setImeiError] = useState("");
  
  // Contract hooks
  const { mintDevice, isPending, isConfirming, isConfirmed, hash, error } = useMintDevice();
  const { isRegistered, isLoading: checkingIMEI } = useCheckIMEI(imei.length === 15 ? imei : undefined);

  // Check IMEI validity
  useEffect(() => {
    if (imei.length === 15) {
      if (!validateIMEI(imei)) {
        setImeiError("Invalid IMEI format");
      } else if (isRegistered) {
        setImeiError("This IMEI is already registered");
      } else {
        setImeiError("");
      }
    } else if (imei.length > 0) {
      setImeiError("IMEI must be 15 digits");
    } else {
      setImeiError("");
    }
  }, [imei, isRegistered]);

  // Auto-advance to success step when minting is confirmed
  useEffect(() => {
    if (isConfirmed && step === 2) {
      setStep(3);
    }
  }, [isConfirmed, step]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newImages = newFiles.map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages].slice(0, 3));
      setUploadedFiles([...uploadedFiles, ...newFiles].slice(0, 3));
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (imeiError) {
      alert("Please fix the IMEI error before continuing");
      return;
    }

    try {
      // Mint the device NFT
      mintDevice(imei);
    } catch (err) {
      console.error("Error minting device:", err);
      alert(err instanceof Error ? err.message : "Failed to mint device NFT");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Register Your Device</h1>
          <p className="text-lg text-muted-foreground">
            Mint your device as an NFT for cryptographic proof of ownership
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-xs text-muted-foreground">Device Info</span>
            </div>
            <div
              className={`h-0.5 flex-1 ${
                step >= 2 ? "bg-primary" : "bg-secondary"
              }`}
            />
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-xs text-muted-foreground">Mint NFT</span>
            </div>
            <div
              className={`h-0.5 flex-1 ${
                step >= 3 ? "bg-primary" : "bg-secondary"
              }`}
            />
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {step > 3 ? <CheckCircle2 className="h-5 w-5" /> : "3"}
              </div>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
          </div>
        </div>

        {/* Step 1: Device Information */}
        {step === 1 && (
          <Card className="mx-auto max-w-3xl border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold">Device Information</h2>
              <p className="text-muted-foreground">
                Enter your device details to create an NFT
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Device Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Apple, Samsung"
                    
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., iPhone 15 Pro"
                    
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input 
                    id="color" 
                    placeholder="e.g., Space Gray"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imei">IMEI / Serial Number</Label>
                <Input
                  id="imei"
                  placeholder="Enter 15-digit IMEI"
                  required
                  className="font-mono"
                  value={imei}
                  onChange={(e) => setImei(e.target.value.replace(/\D/g, "").slice(0, 15))}
                  maxLength={15}
                />
                {imeiError && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                    <p className="text-destructive">{imeiError}</p>
                  </div>
                )}
                {checkingIMEI && (
                  <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
                    <Loader2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary animate-spin" />
                    <p className="text-muted-foreground">Checking IMEI availability...</p>
                  </div>
                )}
                {!imeiError && !checkingIMEI && imei.length === 15 && (
                  <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <p className="text-accent">IMEI is available</p>
                  </div>
                )}
                <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Your IMEI will be hashed using keccak256 and stored
                    on-chain. Only you know the original number, providing
                    cryptographic proof of ownership.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any distinguishing features, scratches, or custom modifications..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Proof Images (1-3 required)</Label>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Proof ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 3 && (
                      <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 transition-colors hover:bg-secondary">
                        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <p className="text-muted-foreground">
                      Upload photos of receipts, original packaging, or device
                      settings screens. These prove ownership and prevent
                      scammers.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!imei || imeiError !== "" || !isConnected}
              >
                {!isConnected ? "Connect Wallet to Continue" : "Continue to Minting"}
              </Button>
            </form>
          </Card>
        )}

        {/* Step 2: Mint NFT */}
        {step === 2 && (
          <Card className="mx-auto max-w-3xl border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold">Mint Device NFT</h2>
              <p className="text-muted-foreground">
                Review and confirm your device registration
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-muted-foreground">Blockchain</span>
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Shield className="h-3 w-3" />
                  Base (Ethereum L2)
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-muted-foreground">Token Standard</span>
                <span className="font-semibold">ERC-721</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-muted-foreground">Estimated Gas Fee</span>
                <span className="font-semibold">~$0.50</span>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Shield className="h-5 w-5 text-primary" />
                What You Get
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Cryptographic proof of ownership stored on blockchain
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Priority listing if you report the device lost
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Compatible with OpenSea, Rarible, and all NFT marketplaces
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  Timestamped proof prevents backdating fake claims
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">Error minting NFT</p>
                    <p className="text-destructive/80">{error.message}</p>
                  </div>
                </div>
              )}
              
              {isPending && (
                <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
                  <Loader2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary animate-spin" />
                  <p className="text-muted-foreground">Waiting for wallet confirmation...</p>
                </div>
              )}
              
              {isConfirming && hash && (
                <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
                  <Loader2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary animate-spin" />
                  <div>
                    <p className="text-muted-foreground">Transaction submitted! Waiting for confirmation...</p>
                    <a 
                      href={getBlockExplorerUrl(hash)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View on BaseScan
                    </a>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isPending ? "Confirm in Wallet..." : "Minting NFT..."}
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Mint Device NFT
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
                onClick={() => setStep(1)}
                disabled={isPending || isConfirming}
              >
                Back to Edit
              </Button>
            </form>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card className="mx-auto max-w-3xl border-border bg-card p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
            </div>
            <h2 className="mb-2 text-3xl font-bold">
              Device Registered Successfully!
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Your device has been minted as an NFT on the Base blockchain
            </p>

            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-muted-foreground">Device</span>
                <span className="font-semibold">{brand} {model}</span>
              </div>
              {hash && (
                <div className="flex flex-col gap-2 rounded-lg bg-secondary p-4">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <a 
                    href={getBlockExplorerUrl(hash)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-primary hover:underline break-all"
                  >
                    {hash}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-muted-foreground">Blockchain</span>
                <span className="font-semibold">Base Sepolia</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => (window.location.href = "/my-devices")}
              >
                View My Devices
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setStep(1);
                  setImei("");
                  setBrand("");
                  setModel("");
                  setColor("");
                  setCategory("");
                  setDescription("");
                  setUploadedImages([]);
                  setUploadedFiles([]);
                }}
              >
                Register Another Device
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
