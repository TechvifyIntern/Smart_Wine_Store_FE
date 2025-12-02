import { FolderX } from "lucide-react";

interface NotFoundCategoryProps {
    message?: string;
    colSpan?: number;
}

export default function NotFoundCategory({
    message = "No categories found",
    colSpan = 4,
}: NotFoundCategoryProps) {
    return (
        <td colSpan={colSpan} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
                <FolderX className="w-12 h-12 text-gray-400 dark:text-slate-600" />
                <p className="text-gray-500 dark:text-slate-400 font-medium">
                    {message}
                </p>
            </div>
        </td>
    );
}
