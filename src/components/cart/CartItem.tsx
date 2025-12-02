import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { CartItem as CartItemType } from "@/types/cart";
import { X } from "lucide-react";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

export default function CartItem({
  item,
  updateQuantity,
  removeItem,
}: CartItemProps) {
  const price = item.product.SalePrice * (1 - item.product.DiscountValue / 100);
  return (
    <TableRow>
      <TableCell className="font-medium text-xs sm:text-sm">
        <Link
          href={`/product-detail/${item.product.ProductID}`}
          className="flex items-center gap-2 sm:gap-4"
        >
          <img
            src={item.product.ImageURL}
            alt={item.product.ProductName}
            width={60}
            height={60}
            className="rounded-md w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover"
          />
          <span className="text-wrap line-clamp-2">
            {item.product.ProductName}
          </span>
        </Link>
      </TableCell>
      <TableCell className="text-xs sm:text-sm">
        <div className="flex flex-col">
          <span>{formatCurrency(price)}</span>
          <span className="line-through text-gray-500">
            {formatCurrency(item.product.SalePrice)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <button
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-7 sm:w-9 md:w-10 hover:bg-primary dark:hover:text-white rounded-l-lg border border-primary text-xs sm:text-sm"
            onClick={() => {
              if (item.Quantity > 1) {
                updateQuantity(item.ProductID, item.Quantity - 1);
              }
            }}
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            readOnly
            pattern="[1-9][0-9]*"
            value={item.Quantity === 0 ? "" : item.Quantity}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (/^\d*$/.test(rawValue)) {
                const newQuantity =
                  rawValue === "" ? 0 : parseInt(rawValue, 10);
                updateQuantity(item.ProductID, newQuantity);
              }
            }}
            onBlur={() => {
              if (item.Quantity < 1) {
                updateQuantity(item.ProductID, 1);
              }
            }}
            className="px-1 sm:px-2 py-1.5 sm:py-2 font-semibold dark:bg-white/5 border border-y-primary w-10 sm:w-12 text-center text-xs sm:text-sm"
          />
          <button
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-7 sm:w-9 md:w-10 hover:bg-primary dark:hover:text-white rounded-r-lg border border-primary text-xs sm:text-sm"
            onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}
          >
            +
          </button>
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm">
        {formatCurrency(price * item.Quantity)}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-9 sm:w-9"
          onClick={() => removeItem(item.ProductID)}
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
