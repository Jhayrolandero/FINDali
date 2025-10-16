"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Wallet,
  Shield,
  ShieldCheck,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  Trophy,
  Package,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Settings,
  Bell,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Mock user data
const initialUserData = {
  // Wallet Info
  address: "0x1234...5678",
  ens: "alice.eth",

  // Profile Info
  displayName: "Alice Johnson",
  email: "alice@example.com",
  phone: "+1 234 567 8900",
  location: "San Francisco, CA",
  bio: "Passionate about helping others find their lost items. Community contributor since 2024.",

  // Account Stats
  memberSince: "March 2024",
  totalFees: 1450,
  itemsReturned: 8,
  itemsPosted: 12,
  successfulReturns: 8,
  reputation: 85,
  currentLevel: "Hero",

  // Verification Status
  kycStatus: "not_verified", // 'not_verified', 'pending', 'verified'
  emailVerified: true,
  phoneVerified: false,

  // Settings
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  privacy: {
    showEmail: false,
    showPhone: false,
    showLocation: true,
  },
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: userData.displayName,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
  });

  const getKycStatusInfo = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          label: "Verified",
          color:
            "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
          badge: "bg-green-500 text-white",
        };
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Pending",
          color:
            "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
          badge: "bg-yellow-500 text-white",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          label: "Not Verified",
          color: "bg-muted/50 text-muted-foreground border-border",
          badge: "bg-muted text-muted-foreground",
        };
    }
  };

  const kycInfo = getKycStatusInfo(userData.kycStatus);

  const handleSaveProfile = () => {
    setUserData({ ...userData, ...editForm });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      displayName: userData.displayName,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">My Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Card */}
            <Card className="border-border bg-card p-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">
                    {userData.displayName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {userData.displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      @{userData.ens}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        {userData.currentLevel}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        {userData.reputation} Rep
                      </Badge>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    {/* Edit Mode */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Display Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editForm.displayName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            displayName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                        {userData.emailVerified && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{userData.email}</p>
                          {userData.emailVerified && (
                            <Badge className="gap-1 bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{userData.phone}</p>
                          {!userData.phoneVerified && (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs"
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-medium">{userData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Member Since
                        </p>
                        <p className="font-medium">{userData.memberSince}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <p className="font-medium">{userData.bio}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* KYC Verification Card */}
            <Card className={`border p-6 ${kycInfo.color}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${kycInfo.badge}`}
                  >
                    {kycInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-bold">KYC Verification</h3>
                      <Badge className={kycInfo.badge}>{kycInfo.label}</Badge>
                    </div>
                    {userData.kycStatus === "not_verified" && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Verify your identity to unlock premium features and
                          earn 2x finder fees
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span>Enhanced Trust Score</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span>Higher Finder Fees (2x)</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span>Priority Support</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {userData.kycStatus === "pending" && (
                      <p className="text-sm text-muted-foreground">
                        Your KYC verification is being processed. This usually
                        takes 24-48 hours.
                      </p>
                    )}
                    {userData.kycStatus === "verified" && (
                      <p className="text-sm text-muted-foreground">
                        Your identity has been verified! You now have access to
                        premium features.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {userData.kycStatus === "not_verified" && (
                    <Link href="/kyc-profile">
                      <Button className="gap-2 whitespace-nowrap">
                        <ShieldCheck className="h-4 w-4" />
                        Start KYC Verification
                      </Button>
                    </Link>
                  )}
                  {userData.kycStatus === "pending" && (
                    <Button
                      variant="outline"
                      disabled
                      className="gap-2 whitespace-nowrap"
                    >
                      <Clock className="h-4 w-4" />
                      Verification Pending
                    </Button>
                  )}
                  {userData.kycStatus === "verified" && (
                    <Link href="/kyc-profile">
                      <Button
                        variant="outline"
                        className="gap-2 whitespace-nowrap"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>

            {/* Wallet Information */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Connected Wallet
                    </p>
                    <p className="font-mono text-lg font-medium">
                      {userData.address}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ENS Name</p>
                    <p className="text-lg font-medium">{userData.ens}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    <Globe className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Settings */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Total Fees</span>
                  </div>
                  <span className="font-bold">{userData.totalFees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">
                      Items Returned
                    </span>
                  </div>
                  <span className="font-bold">{userData.itemsReturned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">Items Posted</span>
                  </div>
                  <span className="font-bold">{userData.itemsPosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">Reputation</span>
                  </div>
                  <span className="font-bold">{userData.reputation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Success Rate</span>
                  </div>
                  <span className="font-bold">
                    {Math.round(
                      (userData.successfulReturns / userData.itemsReturned) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
              <Link href="/my-points">
                <Button variant="outline" className="mt-4 w-full gap-2">
                  <Trophy className="h-4 w-4" />
                  View Full Stats
                </Button>
              </Link>
            </Card>

            {/* Notification Settings */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={userData.notifications.email}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          email: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <input
                    type="checkbox"
                    checked={userData.notifications.sms}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          sms: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={userData.notifications.push}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        notifications: {
                          ...userData.notifications,
                          push: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Lock className="h-5 w-5" />
                Privacy
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Email</span>
                  <input
                    type="checkbox"
                    checked={userData.privacy.showEmail}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        privacy: {
                          ...userData.privacy,
                          showEmail: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Phone</span>
                  <input
                    type="checkbox"
                    checked={userData.privacy.showPhone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        privacy: {
                          ...userData.privacy,
                          showPhone: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Location</span>
                  <input
                    type="checkbox"
                    checked={userData.privacy.showLocation}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        privacy: {
                          ...userData.privacy,
                          showLocation: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Settings className="h-5 w-5" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Security Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Notification Preferences
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Privacy Policy
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
