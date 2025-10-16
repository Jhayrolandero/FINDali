"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Award,
  MessageSquare,
  Filter,
  PackageOpen,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for found items
const mockFoundItems = [
  {
    id: 1,
    brand: "Apple",
    model: "iPhone 14 Pro",
    category: "Phone",
    location: "Central Park, NY",
    foundDate: "3 hours ago",
    finderAddress: "0x7890...abcd",
    finderENS: "goodsamaritan.eth",
    finderReputation: 92,
    finderReturns: 12,
    description:
      "Found near Bethesda Fountain. Rose gold color with cracked screen protector.",
    hasImage: true,
    pointsReward: 150,
  },
  {
    id: 2,
    brand: "Samsung",
    model: "Galaxy Buds Pro",
    category: "Other",
    location: "LAX Airport, CA",
    foundDate: "1 day ago",
    finderAddress: "0xdef0...5678",
    finderENS: null,
    finderReputation: 68,
    finderReturns: 5,
    description:
      "Found in Terminal 3 near Gate 42. Black case with charging cable.",
    hasImage: true,
    pointsReward: 120,
  },
  {
    id: 3,
    brand: "Apple",
    model: "AirPods Pro 2",
    category: "Other",
    location: "Starbucks, Seattle",
    foundDate: "5 hours ago",
    finderAddress: "0x1111...2222",
    finderENS: "finder.eth",
    finderReputation: 85,
    finderReturns: 8,
    description: "Left on table near window. White case with some scratches.",
    hasImage: true,
    pointsReward: 130,
  },
  {
    id: 4,
    brand: "Dell",
    model: "XPS 13 Laptop",
    category: "Laptop",
    location: "Library, Boston",
    foundDate: "2 days ago",
    finderAddress: "0x3333...4444",
    finderENS: null,
    finderReputation: 45,
    finderReturns: 2,
    description: "Found in study room. Silver laptop with university stickers.",
    hasImage: true,
    pointsReward: 180,
  },
  {
    id: 5,
    brand: "Canon",
    model: "EOS R6 Camera",
    category: "Camera",
    location: "Golden Gate Bridge, SF",
    foundDate: "6 hours ago",
    finderAddress: "0x5555...7777",
    finderENS: "helper.eth",
    finderReputation: 78,
    finderReturns: 6,
    description: "Professional camera with lens. Found near visitor center.",
    hasImage: true,
    pointsReward: 200,
  },
];

export default function BrowseFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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
          <h1 className="mb-2 text-4xl font-bold">Browse Found Items</h1>
          <p className="text-lg text-muted-foreground">
            Community members have found these items. Claim yours and help
            finders earn points.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="mb-1 font-semibold">Earn Points by Helping</h3>
              <p className="text-sm text-muted-foreground">
                Found something? Post it here to earn 100-200 points when
                successfully returned. Build your reputation and become a
                community hero!
              </p>
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by brand, model, or location..."
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
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="points">Highest Points</SelectItem>
              <SelectItem value="reputation">Finder Reputation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {mockFoundItems.length} found items
        </div>

        {/* Found Items Listings */}
        <div className="grid gap-6">
          {mockFoundItems.map((item) => {
            const trustLevel = getTrustLevel(item.finderReputation);
            return (
              <Card
                key={item.id}
                className="border-border bg-card p-4 transition-all hover:border-accent/50"
              >
                <div className="flex flex-col gap-3 lg:flex-row">
                  {/* Item Image Placeholder */}
                  <div className="flex h-40 w-full items-center justify-center rounded-lg bg-secondary lg:h-auto lg:w-40">
                    <img
                      src={`/.jpg?height=200&width=200&query=${item.brand} ${item.model} found item`}
                      alt={`${item.brand} ${item.model}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold">
                            {item.brand} {item.model}
                          </h3>
                          <Badge className="gap-1 bg-accent text-accent-foreground text-xs">
                            <PackageOpen className="h-3 w-3" />
                            Found Item
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.foundDate}
                          </span>
                        </div>
                      </div>
                      {/* <div className="text-right">
                        <div className="mb-1 flex items-center gap-2 text-2xl font-bold text-accent">
                          <Award className="h-6 w-6" />
                          {item.pointsReward}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Points Reward
                        </span>
                      </div> */}
                    </div>

                    <p className="mb-3 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    {/* Finder Profile Section - Social Media Style */}
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 p-2">
                      {/* Profile Picture */}
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-bold text-primary">
                          {(item.finderENS || item.finderAddress)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        {/* Trust Badge Overlay */}
                        {item.finderReputation >= 80 && (
                          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent border-2 border-background">
                            <Award className="h-2.5 w-2.5 text-accent-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Finder Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {item.finderENS || item.finderAddress}
                          </span>
                          <Badge
                            className={`${trustLevel.color} text-xs px-1.5 py-0`}
                          >
                            {trustLevel.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Award className="h-2.5 w-2.5" />
                            {item.finderReturns} Returns
                          </span>
                          <span>•</span>
                          <span>{item.finderReputation}% Trust</span>
                        </div>
                      </div>

                      {/* Contact Button */}
                      <Button
                        size="sm"
                        className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs px-3"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Contact
                      </Button>
                    </div>

                    {/* <div className="flex flex-wrap gap-3">
                      <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                        <MessageSquare className="h-4 w-4" />
                        Contact Finder
                      </Button>
                      {/* <Button variant="outline">Claim This Item</Button> */}
                    {/* </div> */}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Post Found Item CTA */}
        <Card className="mt-8 border-accent/20 bg-accent/5 p-8 text-center">
          <PackageOpen className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h3 className="mb-2 text-2xl font-bold">Found Something?</h3>
          <p className="mb-4 text-muted-foreground">
            Post it here to help someone and earn points for your good deed
          </p>
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <PackageOpen className="h-4 w-4" />
            Post Found Item
          </Button>
        </Card>

        {/* Empty State (hidden when there are results) */}
        {mockFoundItems.length === 0 && (
          <Card className="border-border bg-card p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
