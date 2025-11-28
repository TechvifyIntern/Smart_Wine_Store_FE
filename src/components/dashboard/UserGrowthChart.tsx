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
import { TimeFilter } from "@/types/dashboard";
import userManagementRepository from "@/api/userManagementRepository.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function UserGrowthChart() {
  const [filter, setFilter] = useState<TimeFilter>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);

  useEffect(() => {
    const loadUserGrowthData = async () => {
      try {
        setIsLoading(true);
        const response = await userManagementRepository.getAll();

        if (response.success && response.data && Array.isArray(response.data.data)) {
          const users = response.data.data;
          const now = new Date();

          if (filter === "day") {
            // Group by hours for today
            const hourlyUsers = new Array(24).fill(0);
            users.forEach((user: any) => {
              const userDate = new Date(user.CreatedAt);
              if (userDate.toDateString() === now.toDateString()) {
                const hour = userDate.getHours();
                hourlyUsers[hour]++;
              }
            });

            // Get data for every 3 hours
            const labels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
            const data = [0, 3, 6, 9, 12, 15, 18, 21].map(hour => {
              return hourlyUsers.slice(hour, hour + 3).reduce((sum, val) => sum + val, 0);
            });
            setChartLabels(labels);
            setChartValues(data);
          } else if (filter === "week") {
            // Group by days for this week
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
            weekStart.setHours(0, 0, 0, 0);

            const dailyUsers = new Array(7).fill(0);
            users.forEach((user: any) => {
              const userDate = new Date(user.CreatedAt);
              const daysDiff = Math.floor((userDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
              if (daysDiff >= 0 && daysDiff < 7) {
                dailyUsers[daysDiff]++;
              }
            });

            setChartLabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
            setChartValues(dailyUsers);
          } else if (filter === "month") {
            // Group by weeks for this month
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const weeklyUsers = [0, 0, 0, 0, 0];

            users.forEach((user: any) => {
              const userDate = new Date(user.CreatedAt);
              if (userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()) {
                const weekNum = Math.floor((userDate.getDate() - 1) / 7);
                if (weekNum < 5) {
                  weeklyUsers[weekNum]++;
                }
              }
            });

            // Remove weeks with no data from the end
            const lastNonZero = weeklyUsers.findLastIndex(val => val > 0);
            const trimmedData = weeklyUsers.slice(0, Math.max(lastNonZero + 1, 4));
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
        console.error('Error loading user growth data:', error);
        setChartLabels([]);
        setChartValues([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserGrowthData();
  }, [filter]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "New Users",
        data: chartValues,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
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
            return `New Users: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: filter === "day" ? 5 : filter === "week" ? 25 : 50,
        },
      },
    },
  };

  return (
    <Card className="rounded-xl shadow-sm border-[#F2F2F2] dark:border-slate-800/50 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">User Growth</CardTitle>
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
            <Bar data={chartData} options={options} />
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
