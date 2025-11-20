"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header - Full width at top */}
            <Header onMenuClick={toggleMobileSidebar} />

            {/* Content Area with Sidebar */}
            <div className="flex pt-0">
                {/* Sidebar */}
                <Sidebar
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <main className="flex-1 w-full overflow-auto min-h-[calc(100vh-73px)]">
                    {/* Page Content */}
                    <div className="p-6 md:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
