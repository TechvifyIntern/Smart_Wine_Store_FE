"use client";

import { useState, useEffect } from "react";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { overviewData } from "@/data/dashboard/overview";
import userManagementRepository from "@/api/userManagementRepository.js";
import ordersRepository from "@/api/ordersRepository";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState<number | null>(
    null
  );
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState<
    number | null
  >(null);
  const [totalRevenueThisMonth, setTotalRevenueThisMonth] = useState<
    number | null
  >(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch total users and new users this month from API
  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await userManagementRepository.getAll();
        if (response.success && response.data) {
          // Get total count from API response
          const total = response.data.total || response.data.length || 0;
          setTotalUsers(total);

          // Calculate new users this month
          if (Array.isArray(response.data.data)) {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const newUsers = response.data.data.filter((user: any) => {
              if (user.CreatedAt) {
                const createdDate = new Date(user.CreatedAt);
                return (
                  createdDate.getMonth() === currentMonth &&
                  createdDate.getFullYear() === currentYear
                );
              }
              return false;
            });

            setNewUsersThisMonth(newUsers.length);
          }
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    loadUsersData();
  }, []);

  // Fetch orders data and calculate this month's orders and revenue
  useEffect(() => {
    const loadOrdersData = async () => {
      try {
        setIsLoadingOrders(true);
        const response = await ordersRepository.getOrders();
        if (response.success && response.data) {
          // Calculate orders and revenue for this month
          if (Array.isArray(response.data)) {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const ordersThisMonth = response.data.filter((order: any) => {
              if (order.CreatedAt) {
                const orderDate = new Date(order.CreatedAt);
                return (
                  orderDate.getMonth() === currentMonth &&
                  orderDate.getFullYear() === currentYear
                );
              }
              return false;
            });

            setTotalOrdersThisMonth(ordersThisMonth.length);

            // Calculate total revenue this month
            const revenueThisMonth = ordersThisMonth.reduce(
              (sum: number, order: any) => {
                return sum + (order.FinalTotal || 0);
              },
              0
            );
            setTotalRevenueThisMonth(revenueThisMonth);
          } else {
            // If data is not array or empty, set to 0
            setTotalOrdersThisMonth(0);
            setTotalRevenueThisMonth(0);
          }
        } else {
          // If response is not successful, set to 0
          setTotalOrdersThisMonth(0);
          setTotalRevenueThisMonth(0);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        setTotalOrdersThisMonth(0);
        setTotalRevenueThisMonth(0);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    loadOrdersData();
  }, []);

  // Update overview data with real total users and new users this month
  const updatedOverviewData = overviewData.map((data, index) => {
    if (index === 0 && totalUsers !== null) {
      return {
        ...data,
        value: totalUsers.toLocaleString(),
      };
    }
    if (index === 1 && newUsersThisMonth !== null) {
      return {
        ...data,
        value: newUsersThisMonth.toLocaleString(),
      };
    }
    if (index === 2 && totalOrdersThisMonth !== null) {
      return {
        ...data,
        value: totalOrdersThisMonth.toLocaleString(),
      };
    }
    if (index === 3 && totalRevenueThisMonth !== null) {
      return {
        ...data,
        value: `${totalRevenueThisMonth.toLocaleString()}đ`,
      };
    }
    return data;
  });

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
          <OverviewCard
            key={index}
            data={data}
            isLoading={
              index === 0 || index === 1
                ? isLoadingUsers
                : index === 2 || index === 3
                  ? isLoadingOrders
                  : false
            }
          />
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
