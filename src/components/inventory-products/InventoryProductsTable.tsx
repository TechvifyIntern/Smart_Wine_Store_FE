import { InventoryProduct } from "@/app/admin/inventory/products/page";
import ProductRow from "./ProductRow";

interface InventoryProductsTableProps {
    products: InventoryProduct[];
    onEdit: (id: string) => void;
    onImport: (id: string) => void;
    onExport: (id: string) => void;
    formatCurrency: (amount: number) => string;
    emptyMessage?: string;
}

export default function InventoryProductsTable({
    products,
    onEdit,
    onImport,
    onExport,
    formatCurrency,
    emptyMessage = "No products found",
}: InventoryProductsTableProps) {
    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Cost Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Sale Price
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductRow
                                    key={product.ProductID}
                                    product={product}
                                    onEdit={onEdit}
                                    onImport={onImport}
                                    onExport={onExport}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg
                                            className="w-16 h-16 dark:text-slate-700 text-gray-300 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        <p className="dark:text-slate-400 text-gray-500 font-medium">
                                            {emptyMessage}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
