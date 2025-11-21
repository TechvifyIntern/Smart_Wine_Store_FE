"use client";

import { useState } from "react";
import { ContactInfo } from "@/components/profile/ContactInfo";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RecentOrders } from "@/components/profile/RecentOrders";
import { SavedAddresses } from "@/components/profile/SavedAddresses";
import { Settings } from "@/components/profile/Settings";

export default function Page() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      {/* <PageHeader /> */}
      <main className="min-h-screen py-8 bg-white/10 dark:text-gray-200">
        {/* Helmet/Head cho SEO thường được xử lý ở layout hoặc framework cụ thể (Next.js/React Router) */}
        <ProfileHeader isEditMode={isEditMode} setIsEditMode={setIsEditMode} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 ">
            <ContactInfo isEditMode={isEditMode} />
            <SavedAddresses />
            <RecentOrders />
            <Settings />
          </div>
        </div>
      </main>

      {/* <PageFooter /> */}
    </>
  );
}
