import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OverviewCardType } from "@/types/dashboard";

interface OverviewCardProps {
  data: OverviewCardType;
  isLoading?: boolean;
}

export function OverviewCard({ data, isLoading = false }: OverviewCardProps) {
  const { title, value, icon: Icon, iconColor } = data;

  return (
    <Card className="rounded-xl shadow-sm  bg-card text-card-foreground border-[#F2F2F2] dark:border-slate-800/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
