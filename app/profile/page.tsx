"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/lib/firebase/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, User, Phone, MapPin, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import CountrySelect from "@/components/CountrySelect";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [addressLine1, setAddressLine1] = useState(
    profile?.address?.line1 || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    profile?.address?.line2 || ""
  );
  const [city, setCity] = useState(profile?.address?.city || "");
  const [state, setState] = useState(profile?.address?.state || "");
  const [pincode, setPincode] = useState(profile?.address?.pincode || "");
  const [country, setCountry] = useState(profile?.address?.country || "");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile(user.uid);
        if (profileData) {
          setProfile(profileData);
          setDisplayName(profileData.displayName || "");
          setPhoneNumber(profileData.phoneNumber || "");
          setAddressLine1(profileData.address?.line1 || "");
          setAddressLine2(profileData.address?.line2 || "");
          setCity(profileData.address?.city || "");
          setState(profileData.address?.state || "");
          setPincode(profileData.address?.pincode || "");
          setCountry(profileData.address?.country || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!displayName.trim()) {
      toast.error("Name is required");
      return;
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(user.uid, {
        displayName,
        phoneNumber: phoneNumber || "",
        address: {
          line1: addressLine1 || "",
          line2: addressLine2 || "",
          city: city || "",
          state: state || "",
          pincode: pincode || "",
          country: country || "",
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email (Read-only) */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Full Name *
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Line 1 */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Address Line 1
              </label>
              <Input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="House No., Building Name"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Address Line 2
              </label>
              <Input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Road Name, Area, Colony"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            {/* Country and Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Pincode
                </label>
                <Input
                  type="text"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Country
                </label>
                <CountrySelect value={country} onChange={setCountry} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
