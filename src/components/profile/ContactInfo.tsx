"use client";

import React, { useState, useEffect } from "react";
import { currentUser } from "@/data/profile";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Input } from "../ui/input";

interface ContactInfoProps {
  isEditMode: boolean;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ isEditMode }) => {
  const [editData, setEditData] = useState(currentUser);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    location: "",
  });

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is invalid.";
      }
    } else if (name === "phone") {
      if (!value) {
        error = "Phone number is required.";
      } else if (!/^\+?[0-9\s-]{7,}$/.test(value)) {
        error = "Phone number is invalid, must be at least 7 digits.";
      }
    } else if (name === "location") {
      if (!value) {
        error = "Location is required.";
      }
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  useEffect(() => {
    if (!isEditMode) {
      setEditData(currentUser);
      setErrors({ email: "", phone: "", location: "" });
    }
  }, [isEditMode, currentUser]);

  return (
    <div className="bg-card/40 rounded-lg shadow border border-border p-6">
      <h2 className="text-xl font-bold mb-6">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <Mail className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Email</p>
            {isEditMode ? (
              <>
                <Input
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className={`font-semibold ${errors.email && "border-destructive"}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </>
            ) : (
              <p className="font-semibold">{currentUser.email}</p>
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
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  className={`font-semibold ${errors.phone && "border-destructive"}`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </>
            ) : (
              <p className="font-semibold">{currentUser.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="text-primary shrink-0 mt-1" size={20} />
          <div className="w-full space-y-1">
            <p className="text-sm">Location</p>
            {isEditMode ? (
              <>
                <Input
                  name="location"
                  value={editData.location}
                  onChange={handleInputChange}
                  className={`font-semibold ${errors.location && "border-destructive"}`}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </>
            ) : (
              <p className="font-semibold">{currentUser.location}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Calendar className="text-primary shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm">Member Since</p>
            <p className="font-semibold">{currentUser.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
