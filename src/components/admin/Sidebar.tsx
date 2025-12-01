"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  ChevronDown,
  Layers,
  Calendar,
  ShoppingBag,
  ShoppingBasket,
  Award,
  ShoppingCart,
  History,
  ChartNoAxesCombined,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/auth";
import { IsAccessWithAdmin } from "@/lib/permissions";

interface SidebarProps {
  className?: string;
  isMobileSidebarOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  className = "",
  isMobileSidebarOpen = false,
  onClose,
}: SidebarProps) {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAppStore();

  useEffect(() => {
    const isInProductPages = pathname.startsWith("/admin/products");
    const isInDiscountPages = pathname.startsWith("/admin/discounts");
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
      canAccess: (roleId?: string) => IsAccessWithAdmin(roleId),
    },
    {
      label: "Account Management",
      href: "/admin/accounts",
      icon: Users,
      canAccess: (roleId?: string) => IsAccessWithAdmin(roleId),
    },
    {
      label: "Product Management",
      icon: Package,
      hasDropdown: true,
      subItems: [
        {
          label: "Products",
          href: "/admin/products",
          icon: ShoppingBasket,
        },
        {
          label: "Categories",
          href: "/admin/products/categories",
          icon: Layers,
        },
      ],
    },
    {
      label: "Inventory Management",
      href: "/admin/inventory/logs",
      icon: History,
    },
    {
      label: "Order Management",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      label: "Discount Management",
      icon: Tag,
      hasDropdown: true,
      isDiscountMenu: true,
      subItems: [
        {
          label: "Events",
          href: "/admin/discounts/events",
          icon: Calendar,
        },
        {
          label: "Products",
          href: "/admin/discounts/products",
          icon: ShoppingBag,
        },
        {
          label: "Loyal Customers",
          href: "/admin/discounts/tiers",
          icon: Award,
        },
        {
          label: "Orders",
          href: "/admin/discounts/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      label: "IoT",
      href: "/admin/IoT",
      icon: ChartNoAxesCombined,
      canAccess: (roleId?: string) => IsAccessWithAdmin(roleId),
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
    <div className="flex flex-col h-full">
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => item.canAccess?.(user?.roleId) ?? true)
            .map((item, index) => (
              <li key={index}>
                {item.hasDropdown ? (
                  <>
                    {/* Parent with Dropdown */}
                    <button
                      onClick={
                        item.isDiscountMenu
                          ? toggleDiscountDropdown
                          : toggleProductDropdown
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isParentActive(item.subItems)
                          ? "bg-[#AD8D5E] dark:bg-[#7C653E] text-white dark:text-white/90 shadow-md"
                          : "text-[#020202] dark:text-white/90 "
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          (
                            item.isDiscountMenu
                              ? isDiscountDropdownOpen
                              : isProductDropdownOpen
                          )
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Items */}
                    {(item.isDiscountMenu
                      ? isDiscountDropdownOpen
                      : isProductDropdownOpen) && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.subItems?.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              onClick={onClose}
                              className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${
                                isActive(subItem.href)
                                  ? "bg-[#AD8D5E] dark:bg-[#7C653E] text-white shadow-md"
                                  : "text-[#020202] dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-[#AD8D5E] dark:bg-[#7C653E] text-white shadow-md"
                        : "text-[#020202] dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-center">Wineicy</div>
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
        className={`hidden md:block w-60 border-r sticky top-0 h-[100vh] overflow-y-auto ${className}`}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`md:hidden fixed top-[73px] left-0 w-60 border-r h-[calc(100vh-73px)] z-40 transform transition-transform duration-300 overflow-y-auto ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
}
