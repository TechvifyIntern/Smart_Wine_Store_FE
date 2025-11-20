"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Package,
    Warehouse,
    Tag,
    ChevronDown,
    X,
    Layers,
    List,
    Calendar,
    ShoppingBag,
    Award,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    className?: string;
    isMobileSidebarOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ className = "", isMobileSidebarOpen = false, onClose }: SidebarProps) {
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
    const pathname = usePathname();

    // Auto-open dropdown nếu đang ở trang con
    useEffect(() => {
        const isInProductPages = pathname.startsWith('/admin/products');
        const isInDiscountPages = pathname.startsWith('/admin/discounts');
        setIsProductDropdownOpen(isInProductPages);
        setIsDiscountDropdownOpen(isInDiscountPages);
    }, [pathname]);

    const toggleProductDropdown = () => {
        setIsProductDropdownOpen(!isProductDropdownOpen);
    };

    const toggleDiscountDropdown = () => {
        setIsDiscountDropdownOpen(!isDiscountDropdownOpen);
    };

    const menuItems = [
        {
            label: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            label: "Quản lý người dùng",
            href: "/admin/users",
            icon: Users,
        },
        {
            label: "Quản lý sản phẩm",
            icon: Package,
            hasDropdown: true,
            subItems: [
                {
                    label: "Danh mục",
                    href: "/admin/products/category",
                    icon: Layers,
                },
                {
                    label: "Danh sách sản phẩm",
                    href: "/admin/products/list",
                    icon: List,
                },
            ],
        },
        {
            label: "Quản lý kho",
            href: "/admin/inventory",
            icon: Warehouse,
        },
        {
            label: "Quản lý khuyến mãi",
            icon: Tag,
            hasDropdown: true,
            isDiscountMenu: true,
            subItems: [
                {
                    label: "Sự kiện",
                    href: "/admin/discounts/events",
                    icon: Calendar,
                },
                {
                    label: "Sản phẩm",
                    href: "/admin/discounts/products",
                    icon: ShoppingBag,
                },
                {
                    label: "Khách hàng thân thiết",
                    href: "/admin/discounts/tiers",
                    icon: Award,
                },
                {
                    label: "Đơn hàng",
                    href: "/admin/discounts/orders",
                    icon: ShoppingCart,
                },
            ],
        },
    ];

    const isActive = (href?: string) => {
        if (!href) return false;
        return pathname === href;
    };

    const isParentActive = (subItems?: Array<{ href: string }>) => {
        if (!subItems) return false;
        return subItems.some((item) => pathname === item.href);
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full bg-white">
            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {item.hasDropdown ? (
                                <>
                                    {/* Parent with Dropdown */}
                                    <button
                                        onClick={item.isDiscountMenu ? toggleDiscountDropdown : toggleProductDropdown}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isParentActive(item.subItems)
                                            ? "bg-[#eb883b] text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="w-5 h-5 mr-3" />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </div>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${(item.isDiscountMenu ? isDiscountDropdownOpen : isProductDropdownOpen) ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Dropdown Items */}
                                    {(item.isDiscountMenu ? isDiscountDropdownOpen : isProductDropdownOpen) && (
                                        <ul className="mt-1 ml-4 space-y-1">
                                            {item.subItems?.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={subItem.href}
                                                        onClick={onClose}
                                                        className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${isActive(subItem.href)
                                                            ? "bg-[#eb883b] text-white shadow-md"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <subItem.icon className="w-4 h-4 mr-3" />
                                                        <span className="text-sm">{subItem.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                /* Regular Menu Item */
                                <Link
                                    href={item.href!}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive(item.href)
                                        ? "bg-[#eb883b] text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    Wine Store Admin v1.0
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-[73px]"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Desktop */}
            <aside
                className={`hidden md:block w-60 bg-white border-r border-gray-200 sticky top-0 h-[calc(100vh-73px)] overflow-y-auto ${className}`}
            >
                <SidebarContent isMobile={false} />
            </aside>

            {/* Sidebar - Mobile */}
            <aside
                className={`md:hidden fixed top-[73px] left-0 w-60 bg-white border-r border-gray-200 h-[calc(100vh-73px)] z-40 transform transition-transform duration-300 overflow-y-auto ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } ${className}`}
            >
                <SidebarContent isMobile={true} />
            </aside>
        </>
    );
}
