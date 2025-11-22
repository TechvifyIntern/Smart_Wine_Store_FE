import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OverviewCardType } from "@/types/dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface OverviewCardProps {
  data: OverviewCardType;
}

export function OverviewCard({ data }: OverviewCardProps) {
  const { title, value, trend, trendPercentage, icon: Icon, iconColor } = data;

  return (
    <Card className="rounded-xl shadow-sm  bg-card text-card-foreground border-[#F2F2F2] dark:border-slate-800/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"
              }`}
          >
            {trendPercentage}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
