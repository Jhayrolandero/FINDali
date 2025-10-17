"use client";

import { useState } from "react";
import Link from "next/link";
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

// Mock images pool
const mockImages = [
  "https://powermaccenter.com/cdn/shop/files/iPhone_16_Plus_Pink_PDP_Image_Position_1__en-WW.jpg?v=1726236857&width=823",
  "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQGiPkM870Z8sCj1b-P0NXwEU8elRWl8UREkSG9x6Z1Y_Eb15s91fXhr6w9JDnEq0XvPNAOazZr_BCwyx3kPQVzWVW75tjPkD__Sr46EmwX8kRfIeP8I0LM2Q",
  "https://www.apple.com/ph/watch/images/meta/apple-watch__ywfuk5wnf1u2_og.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRMkhGev9ZaPHYLFKlTEWg8kfJGfCmPulXQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrGEKSqlHRT60y4se5VJai1Qqu54iR-Bba0g&s",
];

// Helper function to get random images for each item
const getRandomImages = (itemId: number) => {
  const count = itemId % 5; // 0-4 images based on item ID
  const shuffled = [...mockImages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper function to get random aspect ratio
const getRandomAspectRatio = (itemId: number) => {
  const aspectRatios = [
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[16/9]",
  ];
  return aspectRatios[itemId % aspectRatios.length];
};

// Mock data for found items
const mockFoundItems = [
  {
    id: 1,
    brand: "Apple",
    model: "iPhone 14 Pro",
    category: "Phone",
    location: "BGC, Taguig City",
    foundDate: "3 hours ago",
    finderAddress: "0x1234...abcd",
    finderENS: "alexchen.eth",
    finderReputation: 92,
    finderReturns: 12,
    description:
      "Found near High Street. Rose gold color with cracked screen protector.",
    hasImage: true,
    pointsReward: 150,
  },
  {
    id: 2,
    brand: "Samsung",
    model: "Galaxy Buds Pro",
    category: "Other",
    location: "NAIA Terminal 3, Pasay",
    foundDate: "1 day ago",
    finderAddress: "0x1234...abcd",
    finderENS: "alexchen.eth",
    finderReputation: 92,
    finderReturns: 12,
    description: "Found near Gate 15. Black case with charging cable.",
    hasImage: true,
    pointsReward: 120,
  },
  {
    id: 3,
    brand: "Apple",
    model: "AirPods Pro 2",
    category: "Other",
    location: "SM Mall of Asia, Pasay",
    foundDate: "5 hours ago",
    finderAddress: "0x1234...abcd",
    finderENS: "alexchen.eth",
    finderReputation: 92,
    finderReturns: 12,
    description: "Left on food court table. White case with some scratches.",
    hasImage: true,
    pointsReward: 130,
  },
  {
    id: 4,
    brand: "Dell",
    model: "XPS 13 Laptop",
    category: "Laptop",
    location: "UP Diliman, Quezon City",
    foundDate: "2 days ago",
    finderAddress: "0x1234...abcd",
    finderENS: "alexchen.eth",
    finderReputation: 92,
    finderReturns: 12,
    description:
      "Found in Main Library study area. Silver laptop with university stickers.",
    hasImage: true,
    pointsReward: 180,
  },
  {
    id: 5,
    brand: "Canon",
    model: "EOS R6 Camera",
    category: "Camera",
    location: "Rizal Park, Manila",
    foundDate: "6 hours ago",
    finderAddress: "0x1234...abcd",
    finderENS: "alexchen.eth",
    finderReputation: 92,
    finderReturns: 12,
    description: "Professional camera with lens. Found near Rizal Monument.",
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
      <div className="container mx-auto px-4 py-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-4xl font-bold">Browse Found Items</h1>
          <p className="text-lg text-muted-foreground">
            Community members have found these items.
          </p>
        </div>

        {/* Info Banner */}
        {/* <Card className="mx-auto mb-6 max-w-2xl border-primary/20 bg-primary/5 p-4">
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
        </Card> */}

        {/* Search and Filters */}
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-4 md:flex-row">
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

        {/* Found Items Listings */}
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-4">
            {mockFoundItems.map((item) => {
              const trustLevel = getTrustLevel(item.finderReputation);
              return (
                <Card
                  key={item.id}
                  className="border-border bg-card overflow-hidden transition-all hover:border-accent/50 py-1"
                >
                  {/* Minimalistic Header */}
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                    <Link
                      href={`/user-profile/${item.finderAddress}`}
                      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                        {(item.finderENS || item.finderAddress)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                            {item.finderENS || item.finderAddress}
                          </span>
                          {item.finderReputation >= 80 && (
                            <Award className="h-3.5 w-3.5 text-accent" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.foundDate}
                        </span>
                      </div>
                    </Link>

                    <Badge className={`${trustLevel.color} text-xs px-2 py-1`}>
                      {trustLevel.label}
                    </Badge>
                  </div>

                  {/* Device Images Collage */}
                  {(() => {
                    const images = getRandomImages(item.id);
                    const imageCount = images.length;
                    const aspectRatio = getRandomAspectRatio(item.id);

                    if (imageCount === 0) return null;

                    if (imageCount === 1) {
                      return (
                        <div
                          className={`relative ${aspectRatio} w-full overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10`}
                        >
                          <img
                            src={images[0]}
                            alt={`${item.brand} ${item.model}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      );
                    }

                    if (imageCount === 2) {
                      return (
                        <div
                          className={`grid ${aspectRatio} w-full grid-cols-2 gap-1 overflow-hidden`}
                        >
                          {images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10"
                            >
                              <img
                                src={img}
                                alt={`${item.brand} ${item.model} - ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }

                    if (imageCount === 3) {
                      return (
                        <div
                          className={`grid ${aspectRatio} w-full grid-cols-2 gap-1 overflow-hidden`}
                        >
                          <div className="relative col-span-2 overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10">
                            <img
                              src={images[0]}
                              alt={`${item.brand} ${item.model} - 1`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {images.slice(1).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10"
                            >
                              <img
                                src={img}
                                alt={`${item.brand} ${item.model} - ${idx + 2}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // 4 images - 2x2 grid
                    return (
                      <div
                        className={`grid ${aspectRatio} w-full grid-cols-2 gap-1 overflow-hidden`}
                      >
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10"
                          >
                            <img
                              src={img}
                              alt={`${item.brand} ${item.model} - ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {item.brand} {item.model}
                      </h3>
                      <Badge className="gap-1 bg-accent text-accent-foreground text-xs px-1.5 py-0">
                        <PackageOpen className="h-3 w-3" />
                        Found
                      </Badge>
                    </div>

                    <div className="mb-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.location}</span>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-9 flex-1 gap-1.5 bg-accent text-sm text-accent-foreground hover:bg-accent/90"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 flex-1 gap-1.5 text-sm"
                      >
                        Claim
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Post Found Item CTA */}
        <Card className="mx-auto mt-6 max-w-2xl border-accent/20 bg-accent/5 p-8 text-center">
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
