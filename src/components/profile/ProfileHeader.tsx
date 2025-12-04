"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Save, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, UpdateProfilePayload } from "@/types/profile";
import { toast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";

interface ProfileHeaderProps {
  isEditMode: boolean;
  setIsEditMode: (editing: boolean) => void;
  userProfile: UserProfile | null;
  onSave: (data: UpdateProfilePayload) => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditMode,
  setIsEditMode,
  userProfile,
  onSave,
}) => {
  const [editData, setEditData] = useState({
    name: userProfile?.UserName || "",
  });

  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditData({ name: userProfile.UserName });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    await onSave({ UserName: editData.name });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    if (userProfile) setEditData({ name: userProfile.UserName });
    setIsEditMode(false);
  };

  if (!userProfile) return null;

  return (
    <div className="py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <CldUploadWidget
            uploadPreset="wine_store_avatars"
            options={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              maxFiles: 1,
              resourceType: "image",
              folder: "wine-store/avatars",
            }}
            onOpen={() => setIsHovering(false)}
            onUploadAdded={() => setIsUploading(true)}
            onSuccess={async (result: any) => {
              setIsUploading(false);

              const url = result?.info?.secure_url;
              if (!url)
                return toast({
                  title: "Upload failed!",
                  variant: "destructive",
                });
              await onSave({ ImageURL: url });
              toast({ title: "Avatar updated!", variant: "success" });
            }}
            onError={() => {
              setIsUploading(false);
              toast({ title: "Upload failed", variant: "destructive" });
            }}
          >
            {({ open }) => (
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => open()}
              >
                <Image
                  src={userProfile.ImageURL || "/placeholder.svg"}
                  alt={userProfile.UserName}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />

                {/* Hover Overlay */}
                {isHovering && !isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <Upload className="text-white" size={30} />
                  </div>
                )}

                {/* Uploading Loading */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                    <Loader2 className="animate-spin text-white" size={30} />
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userProfile.UserName}</h1>

            <div className="flex flex-wrap gap-6 text-sm mb-4">
              <div>
                Tier:{" "}
                <span className="font-semibold">{userProfile.TierName}</span>
              </div>
              <div>
                Point:{" "}
                <span className="font-semibold">{userProfile.Point}</span>
              </div>
            </div>

            {/* Edit Buttons */}
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
