"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { topProductsData } from "@/data/dashboard/topProducts";
import { TimeFilter } from "@/types/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function TopProductsChart() {
  const [filter, setFilter] = useState<TimeFilter>("week");

  const currentData = topProductsData[filter];

  const chartData = {
    labels: currentData.map((product) => product.name),
    datasets: [
      {
        label: "Units Sold",
        data: currentData.map((product) => product.sold),
        backgroundColor: "#FF8F6D",
        borderColor: "#FF8F6D",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Sold: ${context.parsed.x} units`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="rounded-xl shadow-sm border-[#F2F2F2] dark:border-slate-800/50 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Top 5 Best Selling Products
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter("day")}>
              Day
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("week")}>
              Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("month")}>
              Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
