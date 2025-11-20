import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface CreateEventButtonProps {
    onClick: () => void;
    label?: string;
}

export default function CreateEventButton({
    onClick,
    label = "Create Event",
}: CreateEventButtonProps) {
    return (
        <Button
            onClick={onClick}
            className="dark:bg-[#c96d2e] flex items-center justify-center gap-2 h-10 px-4 py-2 text-white font-medium rounded-full"
            type="button"
            aria-label={`Create new ${label.toLowerCase()}`}
        >
            <Plus className="w-4 h-4" />
            {label}
        </Button>
    );
}
