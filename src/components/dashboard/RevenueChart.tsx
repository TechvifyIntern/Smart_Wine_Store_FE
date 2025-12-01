"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { TimeFilter } from "@/types/dashboard";
import ordersRepository from "@/api/ordersRepository";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function RevenueChart() {
  const [filter, setFilter] = useState<TimeFilter>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        setIsLoading(true);
        const response = await ordersRepository.getOrders();

        if (response.success && response.data && Array.isArray(response.data)) {
          const orders = response.data;
          const now = new Date();

          if (filter === "day") {
            // Group by hours for today
            const hourlyRevenue = new Array(24).fill(0);
            orders.forEach((order: any) => {
              const orderDate = new Date(order.CreatedAt);
              if (orderDate.toDateString() === now.toDateString()) {
                const hour = orderDate.getHours();
                hourlyRevenue[hour] += order.FinalTotal || 0;
              }
            });

            // Get data for every 3 hours
            const labels = [
              "00:00",
              "03:00",
              "06:00",
              "09:00",
              "12:00",
              "15:00",
              "18:00",
              "21:00",
            ];
            const data = [0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
              return hourlyRevenue
                .slice(hour, hour + 3)
                .reduce((sum, val) => sum + val, 0);
            });
            setChartLabels(labels);
            setChartValues(data);
          } else if (filter === "week") {
            // Group by days for this week
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
            weekStart.setHours(0, 0, 0, 0);

            const dailyRevenue = new Array(7).fill(0);
            orders.forEach((order: any) => {
              const orderDate = new Date(order.CreatedAt);
              const daysDiff = Math.floor(
                (orderDate.getTime() - weekStart.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              if (daysDiff >= 0 && daysDiff < 7) {
                dailyRevenue[daysDiff] += order.FinalTotal || 0;
              }
            });

            setChartLabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
            setChartValues(dailyRevenue);
          } else if (filter === "month") {
            // Group by weeks for this month
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const weeklyRevenue = [0, 0, 0, 0, 0];

            orders.forEach((order: any) => {
              const orderDate = new Date(order.CreatedAt);
              if (
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
              ) {
                const weekNum = Math.floor((orderDate.getDate() - 1) / 7);
                if (weekNum < 5) {
                  weeklyRevenue[weekNum] += order.FinalTotal || 0;
                }
              }
            });

            // Remove weeks with no data from the end
            const lastNonZero = weeklyRevenue.findLastIndex((val) => val > 0);
            const trimmedData = weeklyRevenue.slice(
              0,
              Math.max(lastNonZero + 1, 4)
            );
            const labels = trimmedData.map((_, i) => `Week ${i + 1}`);

            setChartLabels(labels);
            setChartValues(trimmedData);
          }
        } else {
          // Set default empty data
          setChartLabels([]);
          setChartValues([]);
        }
      } catch (error) {
        console.error("Error loading revenue data:", error);
        setChartLabels([]);
        setChartValues([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, [filter]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Revenue (₫)",
        data: chartValues,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Revenue: ₫${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `₫${(value / 1000000).toFixed(0)}M`;
          },
        },
      },
    },
  };

  return (
    <Card className="rounded-xl shadow-sm border-[#F2F2F2] dark:border-slate-800/50 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Revenue</CardTitle>
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
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : chartLabels.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
