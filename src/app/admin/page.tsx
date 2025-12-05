"use client";

import { useState, useEffect } from "react";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { overviewData } from "@/data/dashboard/overview";
import ordersRepository from "@/api/ordersRepository";
import reportsRepository from "@/api/reportsRepository";
import userManagementRepository from "@/api/userManagementRepository";

interface ApiData {
  totalUsers: number | null;
  newUsersThisMonth: number | null;
  totalOrdersThisMonth: number | null;
  totalRevenueThisMonth: number | null;
}

function calculateUpdatedOverviewData(
  staticData: typeof overviewData,
  apiData: ApiData
) {
  return staticData.map((data, index) => {
    switch (index) {
      case 0: // Total Users
        return {
          ...data,
          value:
            apiData.totalUsers !== null
              ? apiData.totalUsers.toLocaleString()
              : data.value,
        };
      case 1: // New Users This Month
        return {
          ...data,
          value:
            apiData.newUsersThisMonth !== null
              ? apiData.newUsersThisMonth.toLocaleString()
              : data.value,
        };
      case 2: // Total Orders This Month
        return {
          ...data,
          value:
            apiData.totalOrdersThisMonth !== null
              ? apiData.totalOrdersThisMonth.toLocaleString()
              : data.value,
        };
      case 3: // Total Revenue This Month
        return {
          ...data,
          value:
            apiData.totalRevenueThisMonth !== null
              ? `${apiData.totalRevenueThisMonth.toLocaleString()}đ`
              : data.value,
        };
      default:
        return data;
    }
  });
}

function calculateOrdersAndRevenueThisMonth(orders: any[]): ApiData {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const ordersThisMonth = orders.filter((order: any) => {
    if (order.CreatedAt) {
      const orderDate = new Date(order.CreatedAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    }
    return false;
  });

  const totalOrdersThisMonth = ordersThisMonth.length;
  const totalRevenueThisMonth = ordersThisMonth.reduce(
    (sum: number, order: any) => sum + (order.FinalTotal || 0),
    0
  );

  return {
    totalUsers: null,
    newUsersThisMonth: null,
    totalOrdersThisMonth,
    totalRevenueThisMonth,
  };
}

export default function Dashboard() {
  const [apiData, setApiData] = useState<ApiData>({
    totalUsers: null,
    newUsersThisMonth: null,
    totalOrdersThisMonth: null,
    totalRevenueThisMonth: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Parallel API calls
        const [usersResponse, newUsersResponse, ordersResponse] =
          await Promise.all([
            userManagementRepository.getAll(),
            reportsRepository.getNewUsers("month"),
            ordersRepository.getOrders(),
          ]);

        let updatedData: ApiData = {
          totalUsers: null,
          newUsersThisMonth: null,
          totalOrdersThisMonth: 0,
          totalRevenueThisMonth: 0,
        };

        // Process users data
        if (usersResponse.success && usersResponse.data.data) {
          updatedData.totalUsers =
            usersResponse.data.total || usersResponse.data.length || 0;
        }

        // Process new users data
        if (newUsersResponse.success && newUsersResponse.data.data) {
          updatedData.newUsersThisMonth =
            newUsersResponse.data.count || newUsersResponse.data.total || 0;
        }

        // Process orders data
        if (ordersResponse.data && Array.isArray(ordersResponse.data.data)) {
          const ordersAndRevenue = calculateOrdersAndRevenueThisMonth(
            ordersResponse.data.data
          );
          updatedData.totalOrdersThisMonth =
            ordersAndRevenue.totalOrdersThisMonth;
          updatedData.totalRevenueThisMonth =
            ordersAndRevenue.totalRevenueThisMonth;
        }

        setApiData(updatedData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setApiData({
          totalUsers: null,
          newUsersThisMonth: null,
          totalOrdersThisMonth: 0,
          totalRevenueThisMonth: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const updatedOverviewData = calculateUpdatedOverviewData(
    overviewData,
    apiData
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold  dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the Wine Store Admin Dashboard
        </p>
      </div>

      {/* Row 1: Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {updatedOverviewData.map((data, index) => (
          <OverviewCard key={index} data={data} isLoading={isLoading} />
        ))}
      </div>

      {/* Row 2: Revenue and User Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      {/* Row 3: Top 5 Best Selling Products Chart */}
      <div className="grid grid-cols-1 gap-6">
        <TopProductsChart />
      </div>

      {/* Row 4: Recent Orders Table */}
      <div className="grid grid-cols-1 gap-6">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
