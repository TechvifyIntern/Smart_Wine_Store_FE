import { Account } from "@/data/accounts";
import AccountRow from "./AccountRow";
import NotFoundAccount from "./NotFoundAccount";

interface AccountTableProps {
    accounts: Account[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, newStatusID: number) => void;
    emptyMessage?: string;
}

export default function AccountTable({
    accounts,
    onView,
    onEdit,
    onDelete,
    onStatusChange,
    emptyMessage = "No accounts found",
}: AccountTableProps) {
    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                User Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Tier
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Points
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <AccountRow
                                    key={account.UserID}
                                    account={account}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onStatusChange={onStatusChange}
                                />
                            ))
                        ) : (
                            <tr>
                                <NotFoundAccount message={emptyMessage} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
