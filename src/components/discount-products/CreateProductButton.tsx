import { Plus } from "lucide-react";

interface CreateProductButtonProps {
    onClick: () => void;
    label?: string;
}

export default function CreateProductButton({
    onClick,
    label = "Create Product Discount",
}: CreateProductButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#AD8D5E] dark:bg-[#7C653E] hover:bg-[#7C653E] text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
        >
            <Plus className="w-4 h-4" />
            {label}
        </button>
    );
}
