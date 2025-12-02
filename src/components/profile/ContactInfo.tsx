"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Calendar, UserRound } from "lucide-react"; // Added UserRound icon
import { Input } from "../ui/input";
import { Button } from "../ui/button"; // Import Button component
import { UserProfile, UpdateProfilePayload } from "@/types/profile"; // Import UpdateProfilePayload
import { z } from "zod"; // Import z
import {
  profileSchema,
  ProfileFormValues,
} from "@/validations/profile/profileSchema"; // Import profileSchema and ProfileFormValues

interface ContactInfoProps {
  isEditMode: boolean;
  userProfile: UserProfile | null;
  onSave: (data: UpdateProfilePayload) => Promise<void>; // Added onSave prop
  setIsEditMode: (value: boolean) => void; // Added setIsEditMode to allow ContactInfo to exit edit mode
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  isEditMode,
  userProfile,
  onSave,
  setIsEditMode,
}) => {
  const [editData, setEditData] = useState<ProfileFormValues>({
    UserName: userProfile?.UserName || "",
    Email: userProfile?.Email || "",
    PhoneNumber: userProfile?.PhoneNumber || "",
    Birthday: userProfile?.Birthday ? userProfile.Birthday.split("T")[0] : "", // Format to YYYY-MM-DD for input type="date"
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditData({
        UserName: userProfile.UserName || "",
        Email: userProfile.Email || "",
        PhoneNumber: userProfile.PhoneNumber || "",
        Birthday: userProfile.Birthday
          ? userProfile.Birthday.split("T")[0]
          : "",
      });
      setErrors([]); // Clear errors when userProfile changes or exits edit mode
    }
  }, [userProfile, isEditMode]); // Depend on isEditMode to reset when toggled

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const parsed = profileSchema.safeParse(editData);
    if (!parsed.success) {
      setErrors(parsed.error.issues);
      setIsSaving(false);
      return;
    }
    setErrors([]);
    try {
      await onSave(parsed.data);
      setIsEditMode(false); // Exit edit mode on successful save
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Optionally set a global error or specific error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset editData to current userProfile values
    if (userProfile) {
      setEditData({
        UserName: userProfile.UserName || "",
        Email: userProfile.Email || "",
        PhoneNumber: userProfile.PhoneNumber || "",
        Birthday: userProfile.Birthday
          ? userProfile.Birthday.split("T")[0]
          : "",
      });
    }
    setErrors([]); // Clear any validation errors
    setIsEditMode(false); // Exit edit mode
  };

  if (!userProfile) {
    return null; // Or a loading spinner, or some placeholder
  }

  // Helper to find specific error for an input field
  const findError = (fieldName: string) => {
    return errors.find((err) => err.path[0] === fieldName)?.message;
  };

  return (
    <div className="bg-card/40 rounded-lg shadow border border-border p-6">
      <h2 className="text-xl font-bold mb-6">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <UserRound className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Username</p>
            {isEditMode ? (
              <>
                <Input
                  name="UserName"
                  value={editData.UserName}
                  onChange={handleInputChange}
                  className={`font-semibold ${findError("UserName") ? "border-destructive" : ""}`}
                />
                {findError("UserName") && (
                  <p className="text-sm text-destructive">
                    {findError("UserName")}
                  </p>
                )}
              </>
            ) : (
              <p className="font-semibold">{userProfile.UserName}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Email</p>
            {isEditMode ? (
              <>
                <Input
                  name="Email"
                  value={editData.Email}
                  onChange={handleInputChange}
                  className={`font-semibold ${findError("Email") ? "border-destructive" : ""}`}
                />
                {findError("Email") && (
                  <p className="text-sm text-destructive">
                    {findError("Email")}
                  </p>
                )}
              </>
            ) : (
              <p className="font-semibold">{userProfile.Email}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Phone</p>
            {isEditMode ? (
              <>
                <Input
                  name="PhoneNumber"
                  value={editData.PhoneNumber}
                  onChange={handleInputChange}
                  className={`font-semibold ${findError("PhoneNumber") ? "border-destructive" : ""}`}
                />
                {findError("PhoneNumber") && (
                  <p className="text-sm text-destructive">
                    {findError("PhoneNumber")}
                  </p>
                )}
              </>
            ) : (
              <p className="font-semibold">{userProfile.PhoneNumber}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Calendar className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Birthday</p>
            {isEditMode ? (
              <>
                <Input
                  type="date"
                  name="Birthday"
                  value={editData.Birthday}
                  onChange={handleInputChange}
                  className={`font-semibold ${findError("Birthday") ? "border-destructive" : ""}`}
                />
                {findError("Birthday") && (
                  <p className="text-sm text-destructive">
                    {findError("Birthday")}
                  </p>
                )}
              </>
            ) : (
              <p className="font-semibold">
                {userProfile.Birthday
                  ? new Date(userProfile.Birthday).toLocaleDateString()
                  : "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};
