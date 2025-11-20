"use client";

import { useState } from "react";
import { Layers, Search, Plus, Edit, Trash2, Package } from "lucide-react";

export default function CategoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const categories = [
        {
            id: 1,
            name: "Red Wine",
            description: "Full-bodied red wines from around the world",
            productCount: 145,
            status: "Active",
            icon: "🍷",
        },
        {
            id: 2,
            name: "White Wine",
            description: "Crisp and refreshing white wine varieties",
            productCount: 98,
            status: "Active",
            icon: "🥂",
        },
        {
            id: 3,
            name: "Champagne",
            description: "Premium sparkling wines and champagne",
            productCount: 67,
            status: "Active",
            icon: "🍾",
        },
        {
            id: 4,
            name: "Rosé Wine",
            description: "Light and elegant rosé wines",
            productCount: 42,
            status: "Active",
            icon: "🌸",
        },
        {
            id: 5,
            name: "Dessert Wine",
            description: "Sweet wines perfect for dessert",
            productCount: 28,
            status: "Inactive",
            icon: "🍰",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Layers className="w-8 h-8 mr-3 text-amber-600" />
                    Product Categories
                </h2>
                <p className="text-gray-600 mt-2">
                    Manage product categories and their details
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Categories</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Layers className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active Categories</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">10</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Layers className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">380</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-purple-600" />
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
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-3">{category.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {category.name}
                                        </h3>
                                        <span
                                            className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${category.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {category.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {category.description}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Package className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{category.productCount}</span>
                                    <span className="ml-1">products</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
