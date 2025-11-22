import { Users, UserPlus, ShoppingCart, DollarSign } from "lucide-react";
import { OverviewCardType } from "@/types/dashboard";

export const overviewData: OverviewCardType[] = [
  {
    title: "Total Users",
    value: "12,450",
    trend: "up",
    trendPercentage: 12.5,
    icon: Users,
    iconColor: "text-blue-600",
  },
  {
    title: "Total New Users This Month",
    value: "1,248",
    trend: "up",
    trendPercentage: 8.3,
    icon: UserPlus,
    iconColor: "text-green-600",
  },
  {
    title: "Total Orders This Month",
    value: "3,842",
    trend: "up",
    trendPercentage: 15.7,
    icon: ShoppingCart,
    iconColor: "text-purple-600",
  },
  {
    title: "Total Revenue This Month",
    value: "₫485,200,000",
    trend: "down",
    trendPercentage: 3.2,
    icon: DollarSign,
    iconColor: "text-orange-600",
  },
];
