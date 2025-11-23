import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { overviewData } from "@/data/dashboard/overview";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold  dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the Wine Store Admin Dashboard
        </p>
      </div>

      {/* Row 1: Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewData.map((data, index) => (
          <OverviewCard key={index} data={data} />
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