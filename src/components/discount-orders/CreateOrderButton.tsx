import { Plus } from "lucide-react";

interface CreateOrderButtonProps {
    onClick: () => void;
    label?: string;
}

export default function CreateOrderButton({
    onClick,
    label = "Create Order Discount",
}: CreateOrderButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#eb883b] hover:bg-[#d97730] text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
        >
            <Plus className="w-4 h-4" />
            {label}
        </button>
    );
}
