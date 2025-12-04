"use client";

import { useState, useEffect, useMemo } from "react";
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
  ChartOptions,
  ChartData,
} from "chart.js";
import { topProductsData } from "@/data/dashboard/topProducts";
import reportsRepository from "@/api/reportsRepository";
import { Spinner } from "@/components/ui/spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Interface for your specific UI component state
interface TopProduct {
  name: string;
  sold: number;
}

export function TopProductsChart() {
  // Added "week" to filter type if you want to support the fallback data correctly
  const [filter, setFilter] = useState<"month" | "year">("month");
  const [currentData, setCurrentData] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reportsRepository.getTopProducts(filter, 10);

        if (response.success && Array.isArray(response.data)) {
          const products = response.data.map((item: any) => ({
            name: item.productName || item.name || "Unknown Product",

            sold: item.totalSold || item.sold || item.quantity || 0,
          }));
          setCurrentData(products);
        }
      } catch (err) {
        console.error("Error fetching top products:", err);
        setError("Failed to load data");
        // Fallback to static data matching the current filter, or default to week
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, [filter]);

  // Use useMemo to prevent unnecessary re-calculations
  const chartData: ChartData<"bar"> = useMemo(
    () => ({
      labels: currentData.map((product) => product.name),
      datasets: [
        {
          label: "Units Sold",
          data: currentData.map((product) => product.sold),
          backgroundColor: "#FF8F6D",
          borderColor: "#FF8F6D",
          borderWidth: 1,
          borderRadius: 4, // Adds rounded corners to bars
          barThickness: 20, // Consistent thickness
        },
      ],
    }),
    [currentData]
  );

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        callbacks: {
          label: function (context) {
            return `Sold: ${context.parsed.x} units`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Cleaner look
        },
      },
      y: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <Card className="rounded-xl shadow-sm border-[#F2F2F2] dark:border-slate-800/50 bg-card text-card-foreground h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Top 5 Best Selling Products
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 capitalize">
              {filter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Ensure these keys match what your API expects */}
            <DropdownMenuItem onClick={() => setFilter("month")}>
              Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("year")}>
              Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <p className="text-sm text-muted-foreground text-red-500">
                {error}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter(filter)}
              >
                Retry
              </Button>
            </div>
          ) : currentData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
