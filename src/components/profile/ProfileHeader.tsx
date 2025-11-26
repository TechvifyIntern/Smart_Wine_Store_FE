"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  isEditMode: boolean;
  setIsEditMode: (editing: boolean) => void;
  userProfile: UserProfile | null; // Add userProfile prop
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditMode,
  setIsEditMode,
  userProfile, // Destructure userProfile prop
}) => {
  const [editData, setEditData] = useState({
    name: userProfile?.UserName || "", // Initialize with prop data
  });

  // Update editData when userProfile changes (e.g., after initial fetch or a save)
  useEffect(() => {
    if (userProfile) {
      setEditData({
        name: userProfile.UserName,
      });
    }
  }, [userProfile]);

  const handleSaveProfile = () => {
    // In a real app, this would trigger an API call to save changes
    // For now, we'll just log and exit edit mode
    console.log("Saving profile changes:", editData);
    setIsEditMode(false);
    // You would typically update the parent component's state here
  };

  const handleCancelEdit = () => {
    // Reset editData to current userProfile values
    if (userProfile) {
      setEditData({ name: userProfile.UserName });
    }
    setIsEditMode(false);
  };

  if (!userProfile) {
    return null; // Or a loading spinner, or some placeholder
  }

  return (
    <div className="py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <Image
              src={userProfile.ImageURL || "/placeholder.svg"}
              alt={userProfile.UserName}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{userProfile.UserName}</h1>
            </div>
            <div className="flex flex-wrap gap-6 text-sm mb-4">
              <div>
                <span className="font-semibold">
                  {userProfile.orders || 99}
                </span>
                <span> Orders</span>
              </div>
              <div>
                <span className="font-semibold">
                  {userProfile.favorites || 99}
                </span>
                <span> Favorites</span>
              </div>
              <div>
                <span className="font-semibold">
                  {userProfile.totalSpent || 99}
                </span>
                <span> Total Spent</span>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditMode(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={16} />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
