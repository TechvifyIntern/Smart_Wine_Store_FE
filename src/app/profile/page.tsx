"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { ContactInfo } from "@/components/profile/ContactInfo";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RecentOrders } from "@/components/profile/RecentOrders";
import { SavedAddresses } from "@/components/profile/SavedAddresses";
import { Settings } from "@/components/profile/Settings";
import {
  getProfile,
  getUserAddress,
  getUserOrder,
  updateProfile,
} from "@/services/profile/api";
import { UpdateProfilePayload } from "@/types/profile";
import { AxiosError } from "axios";
import { useAppStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { logout } = useAppStore();
  const router = useRouter();

  const results = useQueries({
    queries: [
      { queryKey: ["profile"], queryFn: getProfile },
      { queryKey: ["addresses"], queryFn: getUserAddress },
      { queryKey: ["orders"], queryFn: getUserOrder },
    ],
  });

  const profileResult = results[0];
  const addressesResult = results[1];
  const ordersResult = results[2];

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = profileResult;
  const {
    data: userAddresses,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
  } = addressesResult;
  const {
    data: userOrders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = ordersResult;

  const handleUpdateProfile = async (updatedData: UpdateProfilePayload) => {
    if (!userProfile?.data) return;
    try {
      const response = await updateProfile(updatedData);
      if (response.success && response.data) {
        // It's better to invalidate the query and let react-query refetch
        await profileResult.refetch();
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

  if (isProfileLoading || isAddressesLoading || isOrdersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isProfileError) {
    if (
      profileError instanceof AxiosError &&
      profileError.response?.status === 401
    ) {
      logout();
      router.push("/");
      // Return null or a message while redirecting
      return (
        <div className="text-center mt-20 text-red-500">
          Session expired. Redirecting to login...
        </div>
      );
    }
    return (
      <div className="text-center mt-20 text-red-500">
        Error loading profile data.
      </div>
    );
  }
  const error = isAddressesError || isOrdersError;

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load some profile data.
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen py-8 bg-white/10 dark:text-gray-200">
        <ProfileHeader
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          userProfile={userProfile?.data ?? null}
          onSave={handleUpdateProfile}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 ">
            <ContactInfo
              isEditMode={isEditMode}
              userProfile={userProfile?.data ?? null}
              onSave={handleUpdateProfile}
              setIsEditMode={setIsEditMode}
            />
            <SavedAddresses userAddresses={userAddresses?.data || []} />
            <RecentOrders userOrders={userOrders?.data.data || []} />
            <Settings />
          </div>
        </div>
      </main>
    </>
  );
}
