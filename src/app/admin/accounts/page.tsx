"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import accounts, { Account } from "@/data/accounts";
import { CreateAccountFormData } from "@/validations/accounts/accountSchema";
import PageHeader from "@/components/discount-events/PageHeader";
import AccountTable from "@/components/accounts/AccountTable";
import Pagination from "@/components/admin/pagination/Pagination";
import AccountToolbar from "@/components/accounts/AccountToolbar";
import { AccountDetailModal } from "@/components/accounts/(modal)/AccountDetailModal";
import { EditAccountModal } from "@/components/accounts/(modal)/EditAccountModal";

export default function AccountsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [selectedTiers, setSelectedTiers] = useState<number[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);

    // Filter accounts based on search term and filters (UserName or Email, RoleID, TierID, StatusID)
    const filteredAccounts = useMemo(() => {
        let filtered = accounts;

        // Apply search term filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(
                (account) =>
                    account.UserName.toLowerCase().includes(lowerSearchTerm) ||
                    account.Email.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Apply role filter
        if (selectedRoles.length > 0) {
            filtered = filtered.filter((account) => selectedRoles.includes(account.RoleID));
        }

        // Apply tier filter
        if (selectedTiers.length > 0) {
            filtered = filtered.filter((account) => selectedTiers.includes(account.TierID));
        }

        // Apply status filter
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter((account) => selectedStatuses.includes(account.StatusID));
        }

        return filtered;
    }, [searchTerm, selectedRoles, selectedTiers, selectedStatuses]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

    // Action handlers
    const handleView = (id: number) => {
        const account = accounts.find((a) => a.UserID === id);
        if (account) {
            setSelectedAccount(account);
            setIsDetailModalOpen(true);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/admin/accounts/${id}?edit=true`);
    };

    const handleStatusChange = (id: number, newStatusID: number) => {
        console.log(`Changing status for account ${id} to ${newStatusID}`);
        // TODO: Implement API call to update account status
        // Example:
        // await fetch(`/api/accounts/${id}/status`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ StatusID: newStatusID }),
        // });

        const statusNames = ["Active", "Banned", "Pending"];
        alert(`Account status updated to ${statusNames[newStatusID - 1]}!`);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleApplyFilters = (filters: { roles: number[]; tiers: number[]; statuses: number[] }) => {
        setSelectedRoles(filters.roles);
        setSelectedTiers(filters.tiers);
        setSelectedStatuses(filters.statuses);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleCreateAccount = async (
        data: CreateAccountFormData
    ) => {
        console.log("Creating new account:", data);
        // TODO: Implement API call to create account
        // Example:
        // await fetch('/api/accounts', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert("Account created successfully!");
    };

    const handleUpdateAccount = async (
        id: number,
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "Point" | "StatusName" | "StreetAddress" | "Ward" | "Province">
    ) => {
        console.log(`Updating account ${id}:`, data);
        // TODO: Implement API call to update account
        // Example:
        // await fetch(`/api/accounts/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert(`Account ${id} updated successfully!`);
    };

    return (
        <div>
            <PageHeader
                title="Account Management"
                icon={UserCog}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <AccountToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by name, email..."
                onCreateAccount={handleCreateAccount}
                createButtonLabel="Add Account"
                selectedRoles={selectedRoles}
                selectedTiers={selectedTiers}
                selectedStatuses={selectedStatuses}
                onApplyFilters={handleApplyFilters}
            />

            {/* Accounts Table */}
            <AccountTable
                accounts={currentAccounts}
                onView={handleView}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                emptyMessage={
                    searchTerm || selectedRoles.length > 0 || selectedTiers.length > 0 || selectedStatuses.length > 0
                        ? "No accounts found matching your search and filters"
                        : "No accounts found"
                }
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAccounts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Account Detail Modal */}
            <AccountDetailModal
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                account={selectedAccount}
            />

            {/* Edit Account Modal */}
            <EditAccountModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                account={selectedAccount}
                onUpdate={handleUpdateAccount}
            />
        </div>
    );
}
