"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import userManagementRepository from "@/api/userManagementRepository";
import { Account } from "@/data/accounts";
import { CreateAccountFormData } from "@/validations/accounts/accountSchema";
import AccountTable from "@/components/accounts/AccountTable";
import AccountToolbar from "@/components/accounts/AccountToolbar";
import Pagination from "@/components/admin/pagination/Pagination";
import PageHeader from "@/components/discount-events/PageHeader";
import { UserCog } from "lucide-react";
import AccountDetailModal from "@/components/accounts/(modal)/AccountDetailModal";
import EditAccountModal from "@/components/accounts/(modal)/EditAccountModal";
import { StatusChangeDialog } from "@/components/accounts/(modal)/StatusChangeDialog";
import { Spinner } from "@/components/ui/spinner";

export default function AccountsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: number;
    newStatusId: number;
  } | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;

      // Build params for the API
      const params: any = {
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      // Check if searchTerm is a phone number (starts with + or contains only digits)
      const isPhoneSearch =
        searchTerm.trim() && /^[\+\d]/.test(searchTerm.trim());

      if (isPhoneSearch) {
        // Use phone filter in getUsers
        params.phone = searchTerm.trim();
      } else if (searchTerm.trim()) {
        // Use search endpoint for username search
        response = await userManagementRepository.searchUsers(
          searchTerm.trim(),
          currentPage,
          itemsPerPage
        );

        if (response.success && response.data) {
          setAccounts(response.data.data || []);
          setTotalItems(response.data.total || 0);
        } else {
          setAccounts([]);
          setTotalItems(0);
        }
        setIsLoading(false);
        return;
      }

      // Map role IDs to role names (1: Admin, 2: Seller, 3: User)
      if (selectedRoles.length > 0) {
        const roleNames = selectedRoles
          .map((id) => {
            if (id === 1) return "Admin";
            if (id === 2) return "Seller";
            if (id === 3) return "User";
            return "";
          })
          .filter(Boolean);
        if (roleNames.length === 1) {
          params.role = roleNames[0];
        }
      }

      // Map tier IDs to tier names (assuming 1: Bronze, 2: Silver, 3: Gold)
      if (selectedTiers.length > 0) {
        const tierNames = selectedTiers
          .map((id) => {
            if (id === 1) return "Bronze";
            if (id === 2) return "Silver";
            if (id === 3) return "Gold";
            return "";
          })
          .filter(Boolean);
        if (tierNames.length === 1) {
          params.tier = tierNames[0];
        }
      }

      // Map status IDs to status names (1: Active, 2: Inactive)
      if (selectedStatuses.length > 0) {
        const statusNames = selectedStatuses
          .map((id) => {
            if (id === 1) return "Active";
            if (id === 2) return "Inactive";
            return "";
          })
          .filter(Boolean);
        if (statusNames.length === 1) {
          params.status = statusNames[0];
        }
      }

      response = await userManagementRepository.getUsers(params);

      setAccounts(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error: any) {
      console.error("Failed to fetch accounts:", error);

      // Handle authentication errors
      if (
        error.message?.includes("Network Error") ||
        error.response?.status === 401
      ) {
        setError(
          "Unable to load accounts. Please check your connection and try again."
        );
      } else {
        setError("Failed to load accounts. Please try again later.");
      }

      setAccounts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedRoles,
    selectedTiers,
    selectedStatuses,
  ]);

  // Fetch accounts from API
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
    const account = accounts.find((a) => a.UserID === id);
    if (account) {
      setSelectedAccount(account);
      setPendingStatusChange({ id, newStatusId: newStatusID });
      setIsStatusChangeDialogOpen(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      await userManagementRepository.updateUserStatus(
        pendingStatusChange.id,
        pendingStatusChange.newStatusId
      );
      // Refresh the accounts list
      await fetchAccounts();
      setIsStatusChangeDialogOpen(false);
      setPendingStatusChange(null);
      setSelectedAccount(null);
    } catch (error: any) {
      console.error("Failed to update account status:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: {
    roles: number[];
    tiers: number[];
    statuses: number[];
  }) => {
    setSelectedRoles(filters.roles);
    setSelectedTiers(filters.tiers);
    setSelectedStatuses(filters.statuses);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleCreateAccount = async (data: CreateAccountFormData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userManagementRepository.createAccount(data);

      // For now, simulate success
      toast.success(`Tài khoản "${data.UserName}" đã được tạo thành công!`);

      // Auto refresh page after successful creation
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Không thể tạo tài khoản");
    }
  };

  const handleUpdateAccount = async (
    id: number,
    data: Omit<
      Account,
      | "UserID"
      | "RoleName"
      | "TierName"
      | "MinimumPoint"
      | "Point"
      | "StatusName"
      | "StreetAddress"
      | "Ward"
      | "Province"
    >
  ) => {
    // TODO: Implement API call to update account
    // Example:
    // await fetch(`/api/accounts/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchAccounts}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      )}

      {/* Accounts Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <AccountTable
          accounts={accounts}
          onView={handleView}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          emptyMessage={
            error
              ? "Unable to load accounts"
              : searchTerm ||
                  selectedRoles.length > 0 ||
                  selectedTiers.length > 0 ||
                  selectedStatuses.length > 0
                ? "No accounts found matching your search and filters"
                : "No accounts found"
          }
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
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

      {/* Status Change Confirmation Dialog */}
      <StatusChangeDialog
        open={isStatusChangeDialogOpen}
        onOpenChange={setIsStatusChangeDialogOpen}
        account={selectedAccount}
        newStatusId={pendingStatusChange?.newStatusId || 1}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}
