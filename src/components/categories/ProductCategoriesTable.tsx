import { ProductCategory } from "@/data/product_categories";
import CategoryRow from "./CategoryRow";
import NotFoundCategory from "./NotFoundCategory";
import { useAppStore } from "@/store/auth";
import { getCategoryPermissions } from "@/lib/permissions";

interface ProductCategoriesTableProps {
    categories: ProductCategory[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    emptyMessage?: string;
}

export default function ProductCategoriesTable({
    categories,
    onEdit,
    onDelete,
    emptyMessage = "No categories found",
}: ProductCategoriesTableProps) {
    const { user } = useAppStore();
    const permissions = getCategoryPermissions(user?.roleId);
    const showActions = permissions.canEdit || permissions.canDelete;

    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Category Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Description
                            </th>
                            {showActions && (
                                <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <CategoryRow
                                    key={category.CategoryID}
                                    category={category}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    showActions={showActions}
                                />
                            ))
                        ) : (
                            <tr>
                                <NotFoundCategory message={emptyMessage} colSpan={showActions ? 4 : 3} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
