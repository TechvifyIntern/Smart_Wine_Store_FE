"use client";

import { useRouter } from "next/navigation";
import { Edit2, Wine } from "lucide-react";
import { Product } from "@/data/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductRowProps {
  product: Product;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  formatCurrency: (amount: number) => string;
  onStatusChangePending: (id: number, newIsActive: boolean) => void;
}

const getCategoryName = (categoryId: string | number): string => {
  // Simple category mapping - you might want to fetch this from API
  const categories: Record<number, string> = {
    1: "Red Wines",
    2: "White Wines",
    3: "Sparkling Wines",
    4: "Rosé Wines",
  };
  return categories[Number(categoryId)] || `Category ${categoryId}`;
};

const getStatusBadgeColor = (isActive?: boolean): string => {
  return isActive
    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
};

export default function ProductRow({
  product,
  onToggleStatus,
  formatCurrency,
}: ProductRowProps) {
  const router = useRouter();

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
      onClick={() => router.push(`/admin/products/${product.ProductID}`)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        {product.ImageURL ? (
          <img
            src={product.ImageURL}
            alt={product.ProductName}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <Wine className="w-6 h-6 text-gray-400 dark:text-slate-500" />
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="dark:text-slate-400 text-sm font-regular">
          #{product.ProductID}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium max-w-xs">
          {product.ProductName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300">
          {product.CategoryID ? getCategoryName(product.CategoryID) : 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={product.isActive ? "active" : "inactive"}
            onValueChange={(value) => {
              const newIsActive = value === "active";
              onToggleStatus(product.ProductID, newIsActive);
            }}
          >
            <SelectTrigger
              className={`w-[110px] h-7 text-xs font-medium border-0 ${getStatusBadgeColor(product.isActive)}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
              <SelectItem
                value="active"
                className="text-xs dark:text-slate-200 dark:focus:bg-slate-700"
              >
                Active
              </SelectItem>
              <SelectItem
                value="inactive"
                className="text-xs dark:text-slate-200 dark:focus:bg-slate-700"
              >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="dark:text-slate-400 text-sm font-medium">
          {formatCurrency(Number(product.CostPrice))} VND
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {formatCurrency(product.SalePrice)} VND
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/products/${product.ProductID}?edit=true`);
            }}
            title="Edit product"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-[#ad8d5e]/20 dark:border dark:border-slate-700/50 dark:hover:border-[#ad8d5e]/50 dark:text-slate-400 dark:hover:text-[#ad8d5e]"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
