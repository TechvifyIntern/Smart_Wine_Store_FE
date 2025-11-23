import { UserPlus } from "lucide-react";

interface CreateAccountButtonProps {
    onClick: () => void;
    label?: string;
}

export default function CreateAccountButton({
    onClick,
    label = "Add Account",
}: CreateAccountButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-[#ad8d5e] text-white hover:bg-[#9c7d4c] transition-colors text-sm font-medium whitespace-nowrap"
        >
            <UserPlus className="w-4 h-4" />
            {label}
        </button>
    );
}
