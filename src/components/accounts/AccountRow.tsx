import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import { Account } from "@/data/accounts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AccountRowProps {
    account: Account;
    onEdit: (id: number) => void;
    onStatusChange: (id: number, newStatusID: number) => void;
}

export default function AccountRow({
    account,
    onEdit,
    onStatusChange,
}: AccountRowProps) {
    const router = useRouter();
    const isLoyalCustomer = account.TierName === "Gold";

    const getStatusBadgeClass = (statusName: string) => {
        switch (statusName) {
            case "Active":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
            case "Banned":
                return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getRoleBadgeClass = (roleName: string) => {
        switch (roleName) {
            case "Admin":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
            case "Seller":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
            case "Customer":
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getTierBadgeClass = (tierName: string) => {
        switch (tierName) {
            case "Gold":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/30 transition-all duration-200";
            case "Silver":
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
            case "Bronze":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    return (
        <tr
            className={`transition-all duration-200 group cursor-pointer ${
                isLoyalCustomer
                    ? "hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 dark:hover:from-yellow-900/20 dark:hover:to-yellow-900/30 hover:shadow-md hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/20 hover:scale-[1.01] hover:border-l-4 hover:border-l-yellow-400"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800/30 hover:shadow-sm"
            }`}
            onClick={() => router.push(`/admin/accounts/${account.UserID}`)}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{account.UserID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">
                    {account.UserName}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="dark:text-slate-400 text-sm">
                    {account.Email}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm">
                    {account.PhoneNumber}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(account.RoleName)}`}>
                    {account.RoleName}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${getTierBadgeClass(account.TierName)}`}>
                    {account.TierName}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-semibold dark:text-slate-300 ${
                    isLoyalCustomer ? "group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-200" : ""
                }`}>
                    {account.Point.toLocaleString()}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div onClick={(e) => e.stopPropagation()}>
                    <Select
                        value={account.StatusID.toString()}
                        onValueChange={(value) => onStatusChange(account.UserID, parseInt(value))}
                    >
                        <SelectTrigger className={`w-[110px] h-7 text-xs font-medium border-0 ${getStatusBadgeClass(account.StatusName)}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                            <SelectItem value="1" className="text-xs dark:text-slate-200 dark:focus:bg-slate-700">
                                Active
                            </SelectItem>
                            <SelectItem value="2" className="text-xs dark:text-slate-200 dark:focus:bg-slate-700">
                                Banned
                            </SelectItem>
                            <SelectItem value="3" className="text-xs dark:text-slate-200 dark:focus:bg-slate-700">
                                Pending
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(account.UserID); }}
                        title="Edit account"
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                            isLoyalCustomer
                                ? "text-yellow-600 hover:text-yellow-700 hover:scale-110 hover:shadow-lg hover:shadow-yellow-300/50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:shadow-yellow-900/50"
                                : "text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-[#ad8d5e]/20 dark:border dark:border-slate-700/50 dark:hover:border-[#ad8d5e]/50 dark:text-slate-400 dark:hover:text-[#ad8d5e]"
                        }`}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
