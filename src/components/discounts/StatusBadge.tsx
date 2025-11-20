interface StatusBadgeProps {
    status: string;
    getStatusColor?: (status: string) => string;
}

const defaultGetStatusColor = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Scheduled":
            return "bg-blue-100 text-blue-800";
        case "Expired":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function StatusBadge({
    status,
    getStatusColor = defaultGetStatusColor,
}: StatusBadgeProps) {
    return (
        <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                status
            )}`}
        >
            {status}
        </span>
    );
}
