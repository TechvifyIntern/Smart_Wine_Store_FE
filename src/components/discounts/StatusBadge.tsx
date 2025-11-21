interface StatusBadgeProps {
    status: "Active" | "Scheduled" | "Expired" | string;
  }
  
  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusColor = (status: string) => {
      switch(status) {
        case "Active": 
          return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        case "Scheduled": 
          return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "Expired": 
          return "bg-red-500/20 text-red-400 border-red-500/30";
        default: 
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    };
  
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };
  export default StatusBadge;