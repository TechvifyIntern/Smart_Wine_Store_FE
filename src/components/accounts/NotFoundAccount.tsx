import { UserX } from "lucide-react";

interface NotFoundAccountProps {
    message?: string;
}

export default function NotFoundAccount({
    message = "No accounts found",
}: NotFoundAccountProps) {
    return (
        <td colSpan={9} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
                <UserX className="w-12 h-12 text-gray-400 dark:text-slate-600" />
                <p className="text-gray-500 dark:text-slate-400 font-medium">
                    {message}
                </p>
            </div>
        </td>
    );
}
