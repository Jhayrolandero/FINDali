"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  FileText,
  Upload,
  Camera,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

// Mock user data
const userData = {
  address: "0x1234...5678",
  ens: "alice.eth",
  kycStatus: "not_verified", // 'not_verified', 'pending', 'verified', 'rejected'
  kycSubmittedDate: null,
  kycRejectionReason: null,
};

export default function KYCProfilePage() {
  const [kycStatus, setKycStatus] = useState(userData.kycStatus);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    idType: "",
    idNumber: "",
  });

  const handleKycSubmit = () => {
    // In a real app, this would submit the KYC data
    setKycStatus("pending");
    alert("KYC verification submitted successfully! You will receive an email confirmation shortly.");
  };

  const getKycStatusInfo = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle2 className="h-8 w-8" />,
          label: "KYC Verified",
          color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
          badge: "bg-green-500 text-white",
          description: "Your identity has been successfully verified!",
        };
      case "pending":
        return {
          icon: <AlertCircle className="h-8 w-8" />,
          label: "KYC Pending",
          color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
          badge: "bg-yellow-500 text-white",
          description: "Your KYC verification is being reviewed. This usually takes 24-48 hours.",
        };
      case "rejected":
        return {
          icon: <AlertTriangle className="h-8 w-8" />,
          label: "KYC Rejected",
          color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
          badge: "bg-red-500 text-white",
          description: userData.kycRejectionReason || "Your KYC verification was rejected. Please review and resubmit.",
        };
      default:
        return {
          icon: <ShieldCheck className="h-8 w-8" />,
          label: "Not Verified",
          color: "bg-muted/50 text-muted-foreground border-border",
          badge: "bg-muted text-muted-foreground",
          description: "Complete KYC verification to unlock enhanced features and higher finder fees.",
        };
    }
  };

  const kycInfo = getKycStatusInfo(kycStatus);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">KYC Verification</h1>
          <p className="text-lg text-muted-foreground">
            Verify your identity to unlock premium features
          </p>
        </div>

        {/* Status Card */}
        <Card className={`mb-8 border p-6 ${kycInfo.color}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${kycInfo.badge}`}>
                {kycInfo.icon}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Verification Status</h2>
                  <Badge className={kycInfo.badge}>{kycInfo.label}</Badge>
                </div>
                <p className="text-muted-foreground">{kycInfo.description}</p>
                {kycStatus === "verified" && userData.kycSubmittedDate && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Verified on {userData.kycSubmittedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Benefits Section */}
        <Card className="mb-8 border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Benefits of KYC Verification
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Enhanced Trust Score</p>
                <p className="text-sm text-muted-foreground">
                  Increase your reputation by up to 20 points
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Higher Finder Fees</p>
                <p className="text-sm text-muted-foreground">
                  Earn 2x more fees on successful returns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4/10">
                <UserCheck className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="font-semibold">Priority Support</p>
                <p className="text-sm text-muted-foreground">
                  Get faster response times from our team
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Verified Badge</p>
                <p className="text-sm text-muted-foreground">
                  Display verified status on your profile
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Access Premium Features</p>
                <p className="text-sm text-muted-foreground">
                  Unlock exclusive community features
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4/10">
                <AlertCircle className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="font-semibold">Dispute Resolution</p>
                <p className="text-sm text-muted-foreground">
                  Priority in resolving disputes
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* KYC Form - Only show if not verified or pending */}
        {kycStatus === "not_verified" || kycStatus === "rejected" ? (
          <>
            {/* Progress Steps */}
            <Card className="mb-8 border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="mb-4 text-xl font-bold">Verification Process</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      1
                    </div>
                    <div className={`h-1 flex-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
                  </div>
                  <div className="flex flex-1 items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      2
                    </div>
                    <div className={`h-1 flex-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      3
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className={step >= 1 ? "font-medium" : "text-muted-foreground"}>Personal Info</span>
                  <span className={step >= 2 ? "font-medium" : "text-muted-foreground"}>ID Verification</span>
                  <span className={step >= 3 ? "font-medium" : "text-muted-foreground"}>Review</span>
                </div>
              </div>
            </Card>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Card className="mb-8 border-border bg-card p-6">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Country</label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">City</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Postal Code</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter postal code"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} className="gap-2">
                    Continue
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: ID Verification */}
            {step === 2 && (
              <Card className="mb-8 border-border bg-card p-6">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Identity Verification
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium">ID Type</label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.idType}
                      onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    >
                      <option value="">Select ID type</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">ID Number</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter ID number"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Upload ID Documents</label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="mb-1 text-sm font-medium">Front of ID</p>
                        <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="mb-1 text-sm font-medium">Back of ID</p>
                        <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                    </div>
                  </div>

                  {/* Selfie Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Selfie Verification</label>
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                      <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="mb-1 text-sm font-medium">Upload a selfie holding your ID</p>
                      <p className="text-xs text-muted-foreground">Make sure your face and ID are clearly visible</p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-400">
                    <div className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Important:</p>
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li>Ensure all documents are clear and readable</li>
                          <li>Photos should be in color and not edited</li>
                          <li>All four corners of the ID must be visible</li>
                          <li>Your face must be clearly visible in the selfie</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="gap-2">
                    Continue
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Review and Submit */}
            {step === 3 && (
              <Card className="mb-8 border-border bg-card p-6">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <FileText className="h-5 w-5 text-primary" />
                  Review Your Information
                </h3>
                <div className="space-y-6">
                  <div className="rounded-lg bg-secondary p-6">
                    <h4 className="mb-4 font-semibold">Personal Information</h4>
                    <div className="grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date of Birth:</span>
                        <p className="font-medium">{formData.dateOfBirth}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">
                          {formData.address}, {formData.city}, {formData.postalCode}, {formData.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary p-6">
                    <h4 className="mb-4 font-semibold">Identity Verification</h4>
                    <div className="grid gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID Type:</span>
                        <p className="font-medium capitalize">{formData.idType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ID Number:</span>
                        <p className="font-medium">{formData.idNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
                    <div className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Before submitting:</p>
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li>Double-check all information is correct</li>
                          <li>Ensure all documents are uploaded</li>
                          <li>Review our privacy policy and terms of service</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I confirm that all information provided is accurate and I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleKycSubmit} className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Submit Verification
                  </Button>
                </div>
              </Card>
            )}
          </>
        ) : null}

        {/* Pending Status Info */}
        {kycStatus === "pending" && (
          <Card className="border-yellow-500/20 bg-yellow-500/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              What Happens Next?
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  1
                </div>
                <div>
                  <p className="font-medium">Document Review</p>
                  <p className="text-muted-foreground">Our team will verify your submitted documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  2
                </div>
                <div>
                  <p className="font-medium">Identity Confirmation</p>
                  <p className="text-muted-foreground">We'll match your selfie with your ID photo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  3
                </div>
                <div>
                  <p className="font-medium">Email Notification</p>
                  <p className="text-muted-foreground">You'll receive an email once verification is complete</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Verified Status */}
        {kycStatus === "verified" && (
          <Card className="border-green-500/20 bg-green-500/5 p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">You're All Set!</h3>
              <p className="mb-6 text-muted-foreground">
                Your account is now verified. Enjoy enhanced features and higher finder fees!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-green-500 px-4 py-2 text-white">
                  <ShieldCheck className="mr-1 h-4 w-4" />
                  Verified Account
                </Badge>
                <Badge className="bg-primary px-4 py-2 text-primary-foreground">
                  2x Fee Multiplier Active
                </Badge>
                <Badge className="bg-accent px-4 py-2 text-accent-foreground">
                  Priority Support Enabled
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
