import { LucideIcon } from "lucide-react";

// Overview Card Type
export interface OverviewCardType {
  title: string;
  value: string | number;
  trend: "up" | "down";
  trendPercentage: number;
  icon: LucideIcon;
  iconColor: string;
}

// Revenue and User Growth Data Types
export interface ChartDataPoint {
  labels: string[];
  data: number[];
}

export interface RevenueData {
  day: ChartDataPoint;
  week: ChartDataPoint;
  month: ChartDataPoint;
}

export interface UserGrowthData {
  day: ChartDataPoint;
  week: ChartDataPoint;
  month: ChartDataPoint;
}

// Top Products Type
export interface TopProduct {
  id: number;
  name: string;
  sold: number;
}

export interface TopProductsData {
  day: TopProduct[];
  week: TopProduct[];
  month: TopProduct[];
}

// Recent Orders Type
export interface Order {
  orderId: string;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Cancelled";
}

// Filter Type
export type TimeFilter = "day" | "month" | "year";
