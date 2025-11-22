import { Plus } from "lucide-react";

interface CreateCategoryButtonProps {
    onClick: () => void;
    label?: string;
}

export default function CreateCategoryButton({
    onClick,
    label = "Add Category",
}: CreateCategoryButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#AD8D5E] dark:bg-[#7C653E] hover:bg-[#7C653E] dark:hover:bg-[#AD8D5E] text-white  transition-colors text-sm font-medium whitespace-nowrap"
        >
            <Plus className="w-4 h-4" />
            {label}
        </button>
    );
}
