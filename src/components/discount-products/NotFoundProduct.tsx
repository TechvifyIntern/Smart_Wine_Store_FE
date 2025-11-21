import { PackageX } from "lucide-react";

interface NotFoundProductProps {
    message?: string;
}

export default function NotFoundProduct({
    message = "No product discounts found",
}: NotFoundProductProps) {
    return (
        <td colSpan={7} className="px-6 py-12">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                    <PackageX className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {message}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting your search or create a new product discount
                </p>
            </div>
        </td>
    );
}
