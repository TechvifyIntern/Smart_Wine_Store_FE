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
import reportsRepository from "@/api/reportsRepository";

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

        // Map filter to granularity
        let granularity: 'day' | 'month' | 'year' = 'day';
        if (filter === 'month') {
          granularity = 'month';
        } else if (filter === 'week') {
          granularity = 'day';
        }

        const response = await reportsRepository.getNewUsers(granularity);

        if (response.data && Array.isArray(response.data)) {
          const userData = response.data;

          if (filter === "day") {
            // API returns hourly data with label and count
            // Group every 3 hours for better visualization
            const labels: string[] = [];
            const data: number[] = [];

            for (let i = 0; i < userData.length; i += 3) {
              const item = userData[i];
              labels.push(item.label || `${i}:00`);
              // Sum 3 hours together
              const sum = userData.slice(i, i + 3).reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
              data.push(sum);
            }

            setChartLabels(labels);
            setChartValues(data);
          } else if (filter === "week") {
            // API returns daily data with label and count
            const labels = userData.map((item: any) => item.label || "");
            const data = userData.map((item: any) => item.count || 0);
            setChartLabels(labels);
            setChartValues(data);
          } else if (filter === "month") {
            // API returns weekly/monthly data with label and count
            const labels = userData.map((item: any) => item.label || "");
            const data = userData.map((item: any) => item.count || 0);
            setChartLabels(labels);
            setChartValues(data);
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
