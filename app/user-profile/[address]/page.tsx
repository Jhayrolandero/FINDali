"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Award,
  MapPin,
  Mail,
  Twitter,
  Send,
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Mock user data - you can fetch this from blockchain/API later
const mockUserData = {
  "0x1234...abcd": {
    address: "0x1234...abcd",
    name: "Alex Chen",
    bio: "Community member helping reunite lost devices with their owners",
    location: "Makati City, Metro Manila",
    email: "alex.chen@example.ph",
    twitter: "@alexchenph",
    telegram: "@alexchenmanila",
    joinedDate: "2024-01-15",
    isNFTVerified: true,
    reputation: 92,
    stats: {
      devicesReturned: 12,
      devicesReported: 15,
      bountiesEarned: "2.5",
      successRate: 94,
    },
  },
  "0x5678...efgh": {
    address: "0x5678...efgh",
    name: "Alex Chen",
    bio: "Tech enthusiast helping fellow Filipinos recover their devices",
    location: "Quezon City, Metro Manila",
    email: "alex.chen@example.ph",
    twitter: "@alexchenph",
    telegram: "@alexchenqc",
    joinedDate: "2024-02-10",
    isNFTVerified: false,
    reputation: 75,
    stats: {
      devicesReturned: 5,
      devicesReported: 8,
      bountiesEarned: "1.2",
      successRate: 88,
    },
  },
  // Add more mock users as needed
};

const getDefaultUserData = (address: string) => ({
  address,
  name: "Anonymous User",
  bio: "FindChain community member",
  location: "Unknown",
  email: null,
  twitter: null,
  telegram: null,
  joinedDate: "2024-01-01",
  isNFTVerified: false,
  reputation: 50,
  stats: {
    devicesReturned: 0,
    devicesReported: 0,
    bountiesEarned: "0",
    successRate: 0,
  },
});

export default function UserProfilePage() {
  const params = useParams();
  const address = params.address as string;

  const userData =
    mockUserData[address as keyof typeof mockUserData] ||
    getDefaultUserData(address);

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
      <div className="container mx-auto px-4 py-1">
        {/* Back Button */}
        <div>
          <Link href="/browse-lost">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-4 lg:col-span-2">
            {/* Profile Header */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="border-b border-border/50 px-4 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-bold text-primary">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    {userData.isNFTVerified && (
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-blue-500">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h1 className="text-xl font-bold">{userData.name}</h1>
                      <Badge className={trustLevel.color + " text-xs px-1.5 py-0"}>
                        {trustLevel.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {userData.address}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <Award className="h-3 w-3 text-accent" />
                      <span className="font-semibold text-accent">
                        {userData.reputation}%
                      </span>
                      <span className="text-muted-foreground">Trust Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4">
                <div className="space-y-4">
                  {userData.location && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50">
                        <MapPin className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{userData.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm font-medium">
                        {new Date(userData.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {userData.email && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{userData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Bio Section */}
            {userData.bio && (
              <Card className="border-border bg-card overflow-hidden">
                <div className="border-b border-border/50 px-4 py-3">
                  <h3 className="flex items-center gap-2 text-base font-bold">
                    <Package className="h-4 w-4 text-primary" />
                    About
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {userData.bio}
                  </p>
                </div>
              </Card>
            )}

            {/* Social Links Section */}
            {(userData.twitter || userData.telegram) && (
              <Card className="border-border bg-card overflow-hidden">
                <div className="border-b border-border/50 px-4 py-3">
                  <h3 className="flex items-center gap-2 text-base font-bold">
                    <Send className="h-4 w-4 text-primary" />
                    Social Links
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {userData.twitter && (
                    <a
                      href={`https://twitter.com/${userData.twitter.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Twitter className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Twitter</p>
                        <p className="text-sm font-medium">{userData.twitter}</p>
                      </div>
                    </a>
                  )}
                  {userData.telegram && (
                    <a
                      href={`https://t.me/${userData.telegram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/10">
                        <Send className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Telegram</p>
                        <p className="text-sm font-medium">{userData.telegram}</p>
                      </div>
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Community Reputation */}
            <Card className="border-primary/20 bg-primary/5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="mb-1 font-semibold">Community Reputation</h3>
                    <p className="text-sm text-muted-foreground">
                      This user has a {userData.reputation}% trust score based on
                      their activity in the FindChain community.
                      {userData.stats.devicesReturned > 0 &&
                        ` They have successfully returned ${
                          userData.stats.devicesReturned
                        } device${
                          userData.stats.devicesReturned > 1 ? "s" : ""
                        } to their owners.`}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4">
            {/* Stats Cards */}
            <Card className="border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.stats.devicesReturned}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Devices Returned
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.stats.devicesReported}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Devices Reported
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.stats.bountiesEarned} ETH
                  </p>
                  <p className="text-xs text-muted-foreground">Bounties Earned</p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.stats.successRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </Card>

            {/* Contact Button */}
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Mail className="h-4 w-4" />
              Contact User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
