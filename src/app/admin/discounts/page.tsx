"use client";

import { useState } from "react";
import {
    Tag,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Percent,
    Eye,
} from "lucide-react";
import { promotions, getStatusColor, getDiscountBadgeColor } from "../../../data/promotion";
import { formatCurrency } from "@/lib/utils";

export default function PromotionsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Tag className="w-8 h-8 mr-3 text-amber-600" />
                    Promotion Management
                </h2>
                <p className="text-gray-600 mt-2">
                    Create and manage promotional campaigns and discounts
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Promotions</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">24</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Tag className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Tag className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Scheduled</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Avg Discount</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">35%</p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <Percent className="w-6 h-6 text-amber-600" />
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
                                placeholder="Search promotions..."
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
                            Create Promotion
                        </button>
                    </div>
                </div>
            </div>

            {/* Promotions Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Promotion
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Products
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
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {promo.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {promo.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDiscountBadgeColor(
                                                promo.discountType
                                            )}`}
                                        >
                                            {promo.discountType === "Percentage"
                                                ? `${promo.discountValue}% OFF`
                                                : promo.discountType === "Fixed Amount"
                                                    ? `${formatCurrency(promo.discountValue)} OFF`
                                                    : promo.discountType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <div>
                                                <div>{promo.startDate}</div>
                                                <div className="text-xs text-gray-500">
                                                    to {promo.endDate}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">
                                            {promo.productsCount} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="text-amber-600 hover:text-amber-900 mr-3">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
