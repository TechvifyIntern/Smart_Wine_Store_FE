"use client";

import {
    BarChart3,
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    DollarSign,
} from "lucide-react";

export default function Dashboard() {
    const stats = [
        {
            title: "Total Sales",
            value: "$45,231",
            change: "+12.5%",
            icon: DollarSign,
            color: "bg-green-500",
        },
        {
            title: "Total Orders",
            value: "1,234",
            change: "+8.2%",
            icon: ShoppingCart,
            color: "bg-blue-500",
        },
        {
            title: "Total Users",
            value: "3,456",
            change: "+5.1%",
            icon: Users,
            color: "bg-purple-500",
        },
        {
            title: "Total Products",
            value: "567",
            change: "+2.3%",
            icon: Package,
            color: "bg-amber-500",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mt-2">
                    Welcome to the Wine Store Admin Dashboard
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center text-green-600 text-sm font-medium">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-amber-500" />
                        Recent Orders
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((order) => (
                            <div
                                key={order}
                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Order #{1000 + order}
                                    </p>
                                    <p className="text-sm text-gray-500">Customer Name</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-800">
                                        ${(Math.random() * 500 + 100).toFixed(2)}
                                    </p>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-amber-500" />
                        Low Stock Products
                    </h3>
                    <div className="space-y-3">
                        {["Château Margaux 2015", "Dom Pérignon 2010", "Opus One 2018", "Screaming Eagle 2016"].map(
                            (product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{product}</p>
                                        <p className="text-sm text-gray-500">Wine Collection</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                                            {Math.floor(Math.random() * 5 + 1)} left
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}