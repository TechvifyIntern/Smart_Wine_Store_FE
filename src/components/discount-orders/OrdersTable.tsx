import { DiscountOrder } from "@/data/discount_order";
import OrderRow from "./OrderRow";
import NotFoundOrder from "./NotFoundOrder";

interface OrdersTableProps {
    orders: DiscountOrder[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    formatDate: (dateString: string | undefined) => string;
    formatCurrency: (value: number) => string;
    emptyMessage?: string;
}

export default function OrdersTable({
    orders,
    onView,
    onEdit,
    onDelete,
    formatDate,
    formatCurrency,
    emptyMessage = "No order discounts found",
}: OrdersTableProps) {
    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl ">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Id
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Discount (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Minimum Order Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Last Updated
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <OrderRow
                                    key={order.DiscountOrderID}
                                    order={order}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    formatDate={formatDate}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        ) : (
                            <tr>
                                <NotFoundOrder message={emptyMessage} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
