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
    location: "New York, NY",
    email: "alex@example.com",
    twitter: "@alexchen",
    telegram: "@alexchen",
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
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/browse-lost">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </Link>

        {/* Profile Header */}
        <Card className="mb-6 border-border bg-card p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-3xl font-bold text-primary">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              {userData.isNFTVerified && (
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-blue-500">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-col items-center gap-2 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <Badge className={trustLevel.color}>{trustLevel.label}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-accent">
                    {userData.reputation}%
                  </span>
                  <span>Trust Score</span>
                </div>
              </div>

              <p className="mb-2 text-sm text-muted-foreground">
                {userData.address}
              </p>

              {userData.bio && (
                <p className="mb-3 text-muted-foreground">{userData.bio}</p>
              )}

              {userData.location && (
                <div className="mb-3 flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.location}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground md:justify-start">
                <Clock className="h-3 w-3" />
                <span>
                  Joined {new Date(userData.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Contact Button */}
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Mail className="h-4 w-4" />
              Contact User
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Contact Information */}
        <Card className="border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Contact Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userData.email && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <Button size="sm" variant="outline">
                  Send
                </Button>
              </div>
            )}

            {userData.twitter && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Twitter className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Twitter</p>
                  <p className="font-medium">{userData.twitter}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://twitter.com/${userData.twitter.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </Button>
              </div>
            )}

            {userData.telegram && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telegram</p>
                  <p className="font-medium">{userData.telegram}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://t.me/${userData.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message
                  </a>
                </Button>
              </div>
            )}

            {!userData.email && !userData.twitter && !userData.telegram && (
              <div className="col-span-full rounded-lg border border-border bg-card/50 p-8 text-center">
                <p className="text-muted-foreground">
                  No contact information available
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Info */}
        <Card className="mt-6 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-5 w-5 text-primary" />
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
        </Card>
      </div>
    </div>
  );
}
