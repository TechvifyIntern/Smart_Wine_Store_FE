"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Account } from "@/data/accounts";
import userManagementRepository from "@/api/userManagementRepository";
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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce search term for API calls (removed timeout, use direct state change)
    useMemo(() => {
        // No delay needed since we have debouncing in SearchBar
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1);
    }, [searchTerm]);

    // Fetch accounts with React Query using useQueries
    const queries = useQueries({
        queries: [
            {
                queryKey: ["accounts"],
                queryFn: async () => {
                    try {
                        const accountsResponse = await userManagementRepository.getUsers();
                        return accountsResponse?.length > 0 ? accountsResponse : [];
                    } catch (err) {
                        console.error("Error fetching accounts:", err);
                        return [];
                    }
                },
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 10, // 10 minutes
                retry: 1,
                enabled: !debouncedSearchTerm.trim(), // Only enabled if no search
            },
            {
                queryKey: ["accounts", "search", debouncedSearchTerm],
                queryFn: async () => {
                    try {
                        const searchResponse = await userManagementRepository.searchUsers(debouncedSearchTerm.trim());
                        return searchResponse.data?.data || [];
                    } catch (err) {
                        console.error("Error searching accounts:", err);
                        return [];
                    }
                },
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 10,
                retry: 1,
                enabled: !!debouncedSearchTerm.trim(), // Only enabled if search term exists
            },
        ],
    });

    const [allAccountsQuery, searchQuery] = queries;
    const isLoading = allAccountsQuery.isLoading || searchQuery.isLoading;
    const error = allAccountsQuery.error || searchQuery.error;

    // Determine the base data source
    const dataSource = useMemo(() => {
        const data = debouncedSearchTerm.trim() ? searchQuery.data : allAccountsQuery.data;
        return Array.isArray(data) ? data : [];
    }, [debouncedSearchTerm, searchQuery.data, allAccountsQuery.data]);

    // Filter accounts based on filters (RoleID, TierID, StatusID)
    const filteredAccounts = useMemo(() => {
        if (!Array.isArray(dataSource)) {
            return [];
        }

        let filtered = dataSource;

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
    }, [dataSource, selectedRoles, selectedTiers, selectedStatuses]);

    // Calculate pagination
    const safeFilteredAccounts = Array.isArray(filteredAccounts) ? filteredAccounts : [];
    const totalPages = Math.ceil(safeFilteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAccounts = safeFilteredAccounts.slice(startIndex, endIndex);

    // Action handlers
    const handleView = async (id: number) => {
        try {
            const response = await userManagementRepository.getUserById(id);
            const accountData = response?.data;
            if (accountData) {
                setSelectedAccount(accountData);
                setIsDetailModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching account details:", error);
            // Fallback to local data if API fails
            const account = safeFilteredAccounts.find((a) => a.UserID === id);
            if (account) {
                setSelectedAccount(account);
                setIsDetailModalOpen(true);
            }
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/admin/accounts/${id}?edit=true`);
    };

    const handleStatusChange = async (id: number, newStatusID: number) => {
        try {
            await userManagementRepository.updateUserStatus(id, newStatusID);
            alert(`Account status updated to ${statusNames[newStatusID - 1]}!`);
            // Refetch accounts to show updated status
            allAccountsQuery.refetch();
            searchQuery.refetch();
        } catch (error) {
            console.error("Error updating account status:", error);
            alert("Failed to update account status. Please try again.");
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleApplyFilters = (filters: { roles: number[]; tiers: number[]; statuses: number[] }) => {
        setSelectedRoles(filters.roles);
        setSelectedTiers(filters.tiers);
        setSelectedStatuses(filters.statuses);
        setCurrentPage(1);
    };

    const handleCreateAccount = async (
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName"> | CreateAccountFormData
    ) => {
        console.log("Creating new account:", data);
        alert("Account created successfully!");
        // Invalidate and refetch accounts to show the new account
        allAccountsQuery.refetch();
        searchQuery.refetch();
    };

    const handleUpdateAccount = async (
        id: number,
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "Point" | "StatusName" | "StreetAddress" | "Ward" | "Province">
    ) => {
        console.log(`Updating account ${id}:`, data);
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

            {/* Content area */}
            <div className="space-y-4">
                {/* Loading state */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading accounts...</div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="text-lg text-red-600 mb-4">Error loading accounts</div>
                            <div className="text-sm text-gray-600 mb-4">Please try again later</div>
                        </div>
                    </div>
                ) : (
                    <>
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
                            totalItems={safeFilteredAccounts.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </>
                )}
            </div>

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
