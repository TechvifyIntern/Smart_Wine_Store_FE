"use client";

import { useState } from "react";
import {
    Warehouse,
    Search,
    Filter,
    Plus,
    Edit,
    TrendingDown,
    TrendingUp,
    Package,
    AlertTriangle,
} from "lucide-react";

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const inventoryItems = [
        {
            id: 1,
            name: "Château Margaux 2015",
            sku: "WN-CM-2015",
            category: "Red Wine",
            currentStock: 24,
            minStock: 10,
            maxStock: 50,
            location: "Warehouse A - Section 3",
            lastRestocked: "2024-11-10",
            status: "Good",
        },
        {
            id: 2,
            name: "Dom Pérignon 2010",
            sku: "CH-DP-2010",
            category: "Champagne",
            currentStock: 15,
            minStock: 10,
            maxStock: 30,
            location: "Warehouse B - Section 1",
            lastRestocked: "2024-11-12",
            status: "Good",
        },
        {
            id: 3,
            name: "Opus One 2018",
            sku: "WN-OP-2018",
            category: "Red Wine",
            currentStock: 8,
            minStock: 10,
            maxStock: 40,
            location: "Warehouse A - Section 2",
            lastRestocked: "2024-10-28",
            status: "Low",
        },
        {
            id: 4,
            name: "Cloudy Bay Sauvignon Blanc",
            sku: "WN-CB-2023",
            category: "White Wine",
            currentStock: 0,
            minStock: 15,
            maxStock: 60,
            location: "Warehouse C - Section 4",
            lastRestocked: "2024-09-15",
            status: "Critical",
        },
        {
            id: 5,
            name: "Screaming Eagle Cabernet",
            sku: "WN-SE-2019",
            category: "Red Wine",
            currentStock: 3,
            minStock: 5,
            maxStock: 20,
            location: "Warehouse A - Section 1",
            lastRestocked: "2024-11-05",
            status: "Low",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Good":
                return "bg-green-100 text-green-800";
            case "Low":
                return "bg-yellow-100 text-yellow-800";
            case "Critical":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStockPercentage = (current: number, max: number) => {
        return Math.round((current / max) * 100);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Warehouse className="w-8 h-8 mr-3 text-amber-600" />
                    Inventory Management
                </h2>
                <p className="text-gray-600 mt-2">
                    Track and manage stock levels across all warehouses
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Items</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">567</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">In Stock</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">8,234</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Low Stock</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">32</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Critical</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </button>
                        <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            Restock
                        </button>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inventoryItems.map((item) => {
                                const percentage = getStockPercentage(
                                    item.currentStock,
                                    item.maxStock
                                );
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500">{item.category}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-mono">
                                                {item.sku}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <span className="font-bold">{item.currentStock}</span> /{" "}
                                                {item.maxStock} units
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Min: {item.minStock}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${percentage > 50
                                                            ? "bg-green-500"
                                                            : percentage > 20
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {percentage}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.location}</div>
                                            <div className="text-xs text-gray-500">
                                                Last: {item.lastRestocked}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-amber-600 hover:text-amber-900 mr-3">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
