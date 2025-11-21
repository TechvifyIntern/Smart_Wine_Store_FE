import { DiscountProduct } from "@/data/discount_product";
import ProductRow from "./ProductRow";
import NotFoundProduct from "./NotFoundProduct";

interface ProductsTableProps {
    products: DiscountProduct[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    getProductStatus: (timeStart: string, timeEnd: string) => string;
    formatDate: (dateString: string) => string;
    emptyMessage?: string;
}

export default function ProductsTable({
    products,
    onView,
    onEdit,
    onDelete,
    getProductStatus,
    formatDate,
    emptyMessage = "No product discounts found",
}: ProductsTableProps) {
    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl ">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Discount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                End Date
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
                        {products.length > 0 ? (
                            products.map((product) => {
                                const status = getProductStatus(
                                    product.TimeStart,
                                    product.TimeEnd
                                );
                                return (
                                    <ProductRow
                                        key={product.DiscountProductID}
                                        product={product}
                                        status={status}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        formatDate={formatDate}
                                    />
                                );
                            })
                        ) : (
                            <tr>
                                <NotFoundProduct message={emptyMessage} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
