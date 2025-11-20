"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Mail,
    Phone,
    Calendar,
} from "lucide-react";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234 567 8900",
            role: "Customer",
            status: "Active",
            joinDate: "2024-01-15",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 234 567 8901",
            role: "Customer",
            status: "Active",
            joinDate: "2024-02-20",
        },
        {
            id: 3,
            name: "Michael Johnson",
            email: "michael.j@example.com",
            phone: "+1 234 567 8902",
            role: "Admin",
            status: "Active",
            joinDate: "2023-11-10",
        },
        {
            id: 4,
            name: "Emily Davis",
            email: "emily.d@example.com",
            phone: "+1 234 567 8903",
            role: "Customer",
            status: "Inactive",
            joinDate: "2024-03-05",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-amber-600" />
                    User Management
                </h2>
                <p className="text-gray-600 mt-2">
                    Manage all users and their account details
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">3,456</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active Users</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">3,245</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">New This Month</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">234</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Admin Users</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-amber-600" />
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
                                placeholder="Search users..."
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
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                <span className="text-amber-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {user.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {user.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "Admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
