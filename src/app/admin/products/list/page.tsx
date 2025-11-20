"use client";

import { useState } from "react";
import {
    List,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    DollarSign,
} from "lucide-react";

export default function ProductListPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const products = [
        {
            id: 1,
            name: "Château Margaux 2015",
            category: "Red Wine",
            price: 899.99,
            stock: 24,
            status: "In Stock",
            image: "🍷",
        },
        {
            id: 2,
            name: "Dom Pérignon 2010",
            category: "Champagne",
            price: 299.99,
            stock: 15,
            status: "In Stock",
            image: "🍾",
        },
        {
            id: 3,
            name: "Opus One 2018",
            category: "Red Wine",
            price: 450.0,
            stock: 8,
            status: "Low Stock",
            image: "🍷",
        },
        {
            id: 4,
            name: "Cloudy Bay Sauvignon Blanc",
            category: "White Wine",
            price: 45.99,
            stock: 0,
            status: "Out of Stock",
            image: "🥂",
        },
        {
            id: 5,
            name: "Screaming Eagle Cabernet",
            category: "Red Wine",
            price: 3200.0,
            stock: 3,
            status: "Low Stock",
            image: "🍷",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock":
                return "bg-green-100 text-green-800";
            case "Low Stock":
                return "bg-yellow-100 text-yellow-800";
            case "Out of Stock":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <List className="w-8 h-8 mr-3 text-amber-600" />
                    Product List
                </h2>
                <p className="text-gray-600 mt-2">
                    Manage all wine products and their details
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">567</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <List className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">In Stock</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">523</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <List className="w-6 h-6 text-green-600" />
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
                            <List className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <List className="w-6 h-6 text-red-600" />
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
                                placeholder="Search products..."
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
                            Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
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
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-3xl mr-3">{product.image}</div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                                            {product.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">
                                            {product.stock} units
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                product.status
                                            )}`}
                                        >
                                            {product.status}
                                        </span>
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
