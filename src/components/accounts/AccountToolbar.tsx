"use client";

import { useState } from "react";
import SearchBar from "@/components/discount-events/SearchBar";
import CreateAccountButton from "./CreateAccountButton";
import { CreateAccountModal } from "./(modal)/CreateAccountModal";
import { Account } from "@/data/accounts";

interface AccountToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateAccount?: (data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName">) => void | Promise<void>;
    createButtonLabel?: string;
}

export default function AccountToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search accounts...",
    onCreateAccount,
    createButtonLabel = "Add Account",
}: AccountToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateAccount = async (
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName">
    ) => {
        if (onCreateAccount) {
            await onCreateAccount(data);
        } else {
            console.log("Creating account:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Account created successfully!");
        }
    };

    return (
        <>
            {/* Toolbar with padding matching the table (px-6) */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                />

                <CreateAccountButton
                    onClick={() => setIsCreateModalOpen(true)}
                    label={createButtonLabel}
                />
            </div>

            <CreateAccountModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onCreate={handleCreateAccount}
            />
        </>
    );
}
