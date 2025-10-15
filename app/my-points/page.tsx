"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Award,
  TrendingUp,
  Calendar,
  Package,
  PackageOpen,
  Star,
} from "lucide-react";

// Mock user data
const userData = {
  address: "0x1234...5678",
  ens: "alice.eth",
  totalPoints: 1450,
  currentLevel: "Hero",
  nextLevel: "Super Hero",
  pointsToNextLevel: 550,
  reputation: 85,
  accountAge: "6 months",
  itemsReturned: 8,
  itemsPosted: 12,
  successfulReturns: 8,
};

// Level thresholds
const levels = [
  {
    name: "Newcomer",
    minPoints: 0,
    maxPoints: 499,
    color: "text-muted-foreground",
  },
  { name: "Friend", minPoints: 500, maxPoints: 999, color: "text-chart-1" },
  { name: "Hero", minPoints: 1000, maxPoints: 1999, color: "text-primary" },
  {
    name: "Super Hero",
    minPoints: 2000,
    maxPoints: 4999,
    color: "text-accent",
  },
  {
    name: "Legend",
    minPoints: 5000,
    maxPoints: Number.POSITIVE_INFINITY,
    color: "text-chart-4",
  },
];

// Mock points history
const pointsHistory = [
  {
    id: 1,
    action: "Returned iPhone 14 Pro",
    points: 180,
    date: "2024-10-12",
    type: "return",
  },
  {
    id: 2,
    action: "Posted found AirPods",
    points: 120,
    date: "2024-10-10",
    type: "post",
  },
  {
    id: 3,
    action: "Returned MacBook Pro",
    points: 200,
    date: "2024-10-08",
    type: "return",
  },
  {
    id: 4,
    action: "Posted found Galaxy Watch",
    points: 130,
    date: "2024-10-05",
    type: "post",
  },
  {
    id: 5,
    action: "Returned iPad Pro",
    points: 170,
    date: "2024-10-02",
    type: "return",
  },
];

export default function MyPointsPage() {
  const currentLevelData = levels.find((l) => l.name === userData.currentLevel);
  const nextLevelData = levels.find((l) => l.name === userData.nextLevel);
  const progressPercentage = nextLevelData
    ? ((userData.totalPoints - currentLevelData!.minPoints) /
        (nextLevelData.minPoints - currentLevelData!.minPoints)) *
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">My Points & Profile</h1>
          <p className="text-lg text-muted-foreground">
            Track your community contributions and reputation
          </p>
        </div>

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
                {userData.totalPoints} / {nextLevelData?.minPoints} points
              </span>
              <span>{userData.pointsToNextLevel} points to go</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userData.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
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
                userData.totalPoints >= level.minPoints && !isCurrentLevel;
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
                        {level.minPoints} -{" "}
                        {level.maxPoints === Number.POSITIVE_INFINITY
                          ? "∞"
                          : level.maxPoints}{" "}
                        points
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

        {/* Points History */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Points History
          </h3>
          <div className="space-y-3">
            {pointsHistory.map((entry) => (
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
                  <p className="text-xl font-bold text-accent">
                    +{entry.points}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* How to Earn Points */}
        <Card className="mt-8 border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Award className="h-5 w-5 text-primary" />
            How to Earn Points
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Package className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Return Found Items</p>
                <p className="text-sm text-muted-foreground">
                  Earn 100-200 points per successful return
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
                  Higher reputation = more points per return
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
