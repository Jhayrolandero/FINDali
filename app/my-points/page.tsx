"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  TrendingUp,
  Calendar,
  Package,
  PackageOpen,
  Star,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

// Mock user data
const userData = {
  address: "0x1234...5678",
  ens: "alice.eth",
  totalFees: 1450,
  currentLevel: "Hero",
  nextLevel: "Super Hero",
  feesToNextLevel: 550,
  reputation: 85,
  accountAge: "6 months",
  itemsReturned: 8,
  itemsPosted: 12,
  successfulReturns: 8,
  kycStatus: "not_verified", // 'not_verified', 'pending', 'verified'
  kycSubmittedDate: null,
};

// Level thresholds
const levels = [
  {
    name: "Newcomer",
    minFees: 0,
    maxFees: 499,
    color: "text-muted-foreground",
  },
  { name: "Friend", minFees: 500, maxFees: 999, color: "text-chart-1" },
  { name: "Hero", minFees: 1000, maxFees: 1999, color: "text-primary" },
  {
    name: "Super Hero",
    minFees: 2000,
    maxFees: 4999,
    color: "text-accent",
  },
  {
    name: "Legend",
    minFees: 5000,
    maxFees: Number.POSITIVE_INFINITY,
    color: "text-chart-4",
  },
];

// Mock fees history
const feesHistory = [
  {
    id: 1,
    action: "Returned iPhone 14 Pro",
    fees: 180,
    date: "2024-10-12",
    type: "return",
  },
  {
    id: 2,
    action: "Posted found AirPods",
    fees: 120,
    date: "2024-10-10",
    type: "post",
  },
  {
    id: 3,
    action: "Returned MacBook Pro",
    fees: 200,
    date: "2024-10-08",
    type: "return",
  },
  {
    id: 4,
    action: "Posted found Galaxy Watch",
    fees: 130,
    date: "2024-10-05",
    type: "post",
  },
  {
    id: 5,
    action: "Returned iPad Pro",
    fees: 170,
    date: "2024-10-02",
    type: "return",
  },
];

export default function MyPointsPage() {
  const [kycStatus, setKycStatus] = useState(userData.kycStatus);

  const currentLevelData = levels.find((l) => l.name === userData.currentLevel);
  const nextLevelData = levels.find((l) => l.name === userData.nextLevel);
  const progressPercentage = nextLevelData
    ? ((userData.totalFees - currentLevelData!.minFees) /
        (nextLevelData.minFees - currentLevelData!.minFees)) *
      100
    : 100;

  const getTrustLevel = (reputation: number) => {
    if (reputation >= 80)
      return { label: "Trusted", color: "bg-accent text-accent-foreground" };
    if (reputation >= 50)
      return { label: "Verified", color: "bg-primary text-primary-foreground" };
    if (reputation >= 20)
      return { label: "New", color: "bg-secondary text-secondary-foreground" };
    return { label: "Unverified", color: "bg-muted text-muted-foreground" };
  };

  const trustLevel = getTrustLevel(userData.reputation);

  const handleKycSubmit = () => {
    // In a real app, this would trigger the KYC flow
    setKycStatus("pending");
    alert(
      "KYC verification initiated. You will be redirected to the verification process."
    );
  };

  const getKycStatusInfo = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          label: "KYC Verified",
          color:
            "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
          badge: "bg-green-500 text-white",
        };
      case "pending":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          label: "KYC Pending",
          color:
            "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
          badge: "bg-yellow-500 text-white",
        };
      default:
        return {
          icon: <ShieldCheck className="h-5 w-5" />,
          label: "KYC Not Verified",
          color: "bg-muted/50 text-muted-foreground border-border",
          badge: "bg-muted text-muted-foreground",
        };
    }
  };

  const kycInfo = getKycStatusInfo(kycStatus);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">My Find Fees & Profile</h1>
          <p className="text-lg text-muted-foreground">
            Track your finder fees and community reputation
          </p>
        </div>

        {/* KYC Profile Section */}
        <Card className={`mb-8 border p-6 ${kycInfo.color}`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${kycInfo.badge}`}
              >
                {kycInfo.icon}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-bold">KYC Verification Status</h3>
                  <Badge className={kycInfo.badge}>{kycInfo.label}</Badge>
                </div>
                {kycStatus === "not_verified" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Complete KYC verification to increase your trust level and
                      unlock higher finder fees.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>Enhanced Trust Score</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>Higher Fee Multipliers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>Priority Support</span>
                      </div>
                    </div>
                  </div>
                )}
                {kycStatus === "pending" && (
                  <p className="text-sm text-muted-foreground">
                    Your KYC verification is being processed. This usually takes
                    24-48 hours. We'll notify you once it's complete.
                  </p>
                )}
                {kycStatus === "verified" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your identity has been verified! You now have access to
                      enhanced features and higher finder fees.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">
                        Verified since{" "}
                        {userData.kycSubmittedDate || "October 2024"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {kycStatus === "not_verified" && (
                <Button
                  onClick={handleKycSubmit}
                  className="gap-2 whitespace-nowrap"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Start KYC Verification
                </Button>
              )}
              {kycStatus === "pending" && (
                <Button
                  variant="outline"
                  disabled
                  className="gap-2 whitespace-nowrap"
                >
                  <AlertCircle className="h-4 w-4" />
                  Verification Pending
                </Button>
              )}
              {kycStatus === "verified" && (
                <Badge className="gap-2 bg-green-500 px-4 py-2 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified Account
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Card */}
        <Card className="mb-8 border-border bg-card p-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userData.ens}</h2>
                  <p className="font-mono text-sm text-muted-foreground">
                    {userData.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={trustLevel.color}>{trustLevel.label}</Badge>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {userData.accountAge}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" />
                {userData.reputation} Reputation
              </Badge>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Current Level:
                </span>
                <span
                  className={`text-lg font-bold ${currentLevelData?.color}`}
                >
                  {userData.currentLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Next Level:
                </span>
                <span className={`text-lg font-bold ${nextLevelData?.color}`}>
                  {userData.nextLevel}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="mb-2 h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {userData.totalFees} / {nextLevelData?.minFees} fees
              </span>
              <span>{userData.feesToNextLevel} fees to go</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userData.totalFees}</p>
                <p className="text-sm text-muted-foreground">Total Find Fees</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userData.itemsReturned}</p>
                <p className="text-sm text-muted-foreground">Items Returned</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <PackageOpen className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userData.itemsPosted}</p>
                <p className="text-sm text-muted-foreground">Items Posted</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Level System Info */}
        <Card className="mb-8 border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Award className="h-5 w-5 text-primary" />
            Level System
          </h3>
          <div className="space-y-3">
            {levels.map((level, index) => {
              const isCurrentLevel = level.name === userData.currentLevel;
              const isPastLevel =
                userData.totalFees >= level.minFees && !isCurrentLevel;
              return (
                <div
                  key={level.name}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    isCurrentLevel
                      ? "border-primary bg-primary/5"
                      : isPastLevel
                      ? "border-accent/30 bg-accent/5"
                      : "border-border bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isCurrentLevel
                          ? "bg-primary text-primary-foreground"
                          : isPastLevel
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-bold ${level.color}`}>{level.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {level.minFees} -{" "}
                        {level.maxFees === Number.POSITIVE_INFINITY
                          ? "∞"
                          : level.maxFees}{" "}
                        fees
                      </p>
                    </div>
                  </div>
                  {isCurrentLevel && (
                    <Badge className="bg-primary text-primary-foreground">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Current
                    </Badge>
                  )}
                  {isPastLevel && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Trophy className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Find Fees History */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Find Fees History
          </h3>
          <div className="space-y-3">
            {feesHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      entry.type === "return" ? "bg-accent/10" : "bg-chart-4/10"
                    }`}
                  >
                    {entry.type === "return" ? (
                      <Package className="h-5 w-5 text-accent" />
                    ) : (
                      <PackageOpen className="h-5 w-5 text-chart-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{entry.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent">+{entry.fees}</p>
                  <p className="text-xs text-muted-foreground">fees</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* How to Earn Find Fees */}
        <Card className="mt-8 border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Award className="h-5 w-5 text-primary" />
            How to Earn Find Fees
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Package className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Return Found Items</p>
                <p className="text-sm text-muted-foreground">
                  Earn 100-200 fees per successful return
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-4/20">
                <PackageOpen className="h-4 w-4 text-chart-4" />
              </div>
              <div>
                <p className="font-semibold">Post Found Items</p>
                <p className="text-sm text-muted-foreground">
                  Build reputation by helping the community
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Build Reputation</p>
                <p className="text-sm text-muted-foreground">
                  Higher reputation = more fees per return
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Trophy className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Level Up</p>
                <p className="text-sm text-muted-foreground">
                  Unlock badges and community recognition
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
