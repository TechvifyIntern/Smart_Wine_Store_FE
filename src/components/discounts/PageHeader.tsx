import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    icon: LucideIcon;
    iconColor?: string;
}

export default function PageHeader({
    title,
    icon: Icon,
    iconColor = "text-blue-600",
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <Icon className={`w-8 h-8 mr-3 ${iconColor}`} />
                {title}
            </h2>
        </div>
    );
}
