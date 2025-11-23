"use client";

import { useState, useMemo } from "react";
import { UserCog } from "lucide-react";
import accounts, { Account } from "@/data/accounts";
import PageHeader from "@/components/discount-events/PageHeader";
import AccountTable from "@/components/accounts/AccountTable";
import Pagination from "@/components/admin/pagination/Pagination";
import AccountToolbar from "@/components/accounts/AccountToolbar";
import { AccountDetailModal } from "@/components/accounts/(modal)/AccountDetailModal";
import { EditAccountModal } from "@/components/accounts/(modal)/EditAccountModal";
import { DeleteAccountDialog } from "@/components/accounts/(modal)/DeleteAccountDialog";

export default function AccountsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

    // Filter accounts based on search term (UserName or Email)
    const filteredAccounts = useMemo(() => {
        if (!searchTerm.trim()) {
            return accounts;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        // Example:
        // const response = await fetch(`/api/accounts/search?query=${encodeURIComponent(searchTerm)}`);
        // return await response.json();

        return accounts.filter(
            (account) =>
                account.UserName.toLowerCase().includes(lowerSearchTerm) ||
                account.Email.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

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
        const account = accounts.find((a) => a.UserID === id);
        if (account) {
            setSelectedAccount(account);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        const account = accounts.find((a) => a.UserID === id);
        if (account) {
            setAccountToDelete(account);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (accountToDelete) {
            console.log("Delete account:", accountToDelete.UserID);
            // TODO: Implement API call to delete account
            // Example:
            // await fetch(`/api/accounts/${accountToDelete.UserID}`, {
            //   method: 'DELETE',
            // });

            alert(`Account "${accountToDelete.UserName}" deleted successfully!`);
            setIsDeleteDialogOpen(false);
            setAccountToDelete(null);
        }
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

    const handleCreateAccount = async (
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName">
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
            />

            {/* Accounts Table */}
            <AccountTable
                accounts={currentAccounts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                emptyMessage={
                    searchTerm
                        ? `No accounts found matching "${searchTerm}"`
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

            {/* Delete Confirmation Dialog */}
            <DeleteAccountDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                account={accountToDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
