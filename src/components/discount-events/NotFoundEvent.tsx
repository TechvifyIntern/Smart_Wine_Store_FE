import { Calendar } from "lucide-react";

export default function NotFoundEvent({ message }: { message: string }) {
    return (
        <td
            colSpan={8}
            className="px-6 py-12 text-center text-gray-500"
        >
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm mt-1">
                Try adjusting your search criteria
            </p>
        </td>
    )
}