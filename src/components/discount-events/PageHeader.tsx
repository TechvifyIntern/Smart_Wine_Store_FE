import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    icon: LucideIcon;
    iconColor?: string;
}

export default function PageHeader({
    title,
    icon: Icon,
    iconColor = "text-black",
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold flex items-center">
                <Icon className={`w-8 h-7 mr-3 ${iconColor} dark:text-white`} />
                {title}
            </h2>
        </div>
    );
}
