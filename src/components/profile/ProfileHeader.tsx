"use client";

import React, { useState } from "react";
import Image from "next/image";
import { currentUser as initialUser } from "@/data/profile";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isEditMode: boolean;
  setIsEditMode: (editing: boolean) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditMode,
  setIsEditMode,
}) => {
  const [user, setUser] = useState(initialUser);
  const [editData, setEditData] = useState({
    name: initialUser.name,
    bio: initialUser.bio,
  });

  const handleSaveProfile = () => {
    setUser({ ...user, name: editData.name, bio: editData.bio });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditData({ name: user.name, bio: user.bio });
    setIsEditMode(false);
  };

  return (
    <div className="py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
            </div>
            <div className="flex flex-wrap gap-6 text-sm mb-4">
              <div>
                <span className="font-semibold">{user.orders}</span>
                <span> Orders</span>
              </div>
              <div>
                <span className="font-semibold">{user.favorites}</span>
                <span> Favorites</span>
              </div>
              <div>
                <span className="font-semibold">{user.totalSpent}</span>
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
