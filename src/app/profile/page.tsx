"use client";

import { useEffect, useState } from "react";
import { ContactInfo } from "@/components/profile/ContactInfo";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RecentOrders } from "@/components/profile/RecentOrders";
import { SavedAddresses } from "@/components/profile/SavedAddresses";
import { Settings } from "@/components/profile/Settings";
import {
  getProfile,
  getUserAddress,
  getUserOrder,
  updateProfile, // Import updateProfile
} from "@/services/profile/api";
import {
  UserProfile,
  UserAddress,
  Order,
  UpdateProfilePayload,
} from "@/types/profile"; // Import UpdateProfilePayload
import { AxiosError } from "axios";
import { useAppStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, addressResponse, orderResponse] =
          await Promise.all([getProfile(), getUserAddress(), getUserOrder()]);

        if (!profileResponse.success) {
          throw new Error(profileResponse.message);
        }
        setUserProfile(profileResponse.data);

        if (!addressResponse.success) {
          throw new Error(addressResponse.message);
        }
        setUserAddresses(addressResponse.data);

        if (!orderResponse.success) {
          throw new Error(orderResponse.message);
        }
        setUserOrders(orderResponse.data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            setError("Session expired. Please log in again.");
            logout();
            router.push("/");
          } else {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Failed to load profile data."
            );
          }
        } else {
          setError((err as Error).message || "Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout, router]);

  const handleUpdateProfile = async (updatedData: UpdateProfilePayload) => {
    if (!userProfile) return;
    try {
      const response = await updateProfile(updatedData);
      if (response.success && response.data) {
        setUserProfile(response.data); // Update local state with new profile data
        toast.success("Profile updated successfully!");
        setIsEditMode(false); // Exit edit mode after successful update
      } else {
        toast.error(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to update profile."
        );
      } else {
        toast.error("Failed to update profile.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* <PageHeader /> */}
      <main className="min-h-screen py-8 bg-white/10 dark:text-gray-200">
        <ProfileHeader
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          userProfile={userProfile}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 ">
            <ContactInfo
              isEditMode={isEditMode}
              userProfile={userProfile}
              onSave={handleUpdateProfile} // Pass the update handler
              setIsEditMode={setIsEditMode} // Pass setIsEditMode
            />
            <SavedAddresses userAddresses={userAddresses} />
            <RecentOrders userOrders={userOrders} />
            <Settings />
          </div>
        </div>
      </main>
    </>
  );
}
