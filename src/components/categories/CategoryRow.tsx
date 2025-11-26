import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/data/product_categories";

interface CategoryRowProps {
    category: ProductCategory;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CategoryRow({
    category,
    onEdit,
    onDelete,
}: CategoryRowProps) {
    const router = useRouter();

    return (
        <tr
            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
            onClick={() => router.push(`/admin/products/categories/${category.CategoryID}`)}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{category.CategoryID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">
                    {category.CategoryName}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="dark:text-slate-400 text-sm max-w-xs">
                    {category.Description}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm">
                    {category.ParentCategoryName || "-"}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {category.ProductCount}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(category.CategoryID); }}
                        title="Edit category"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-orange-500/20 dark:border dark:border-slate-700/50 dark:hover:border-orange-500/50 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(category.CategoryID); }}
                        title="Delete category"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-red-500 dark:bg-slate-800/50 dark:hover:bg-red-500/20 dark:border dark:border-slate-700/50 dark:hover:border-red-500/50 dark:text-slate-400 dark:hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
