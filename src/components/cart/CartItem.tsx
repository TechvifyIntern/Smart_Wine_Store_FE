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
  const price =
    Number(item.product.SalePrice) < Number(item.product.CostPrice)
      ? item.product.SalePrice
      : item.product.CostPrice;
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link
          href={`/product-detail/${item.product.ProductID}`}
          className="flex items-center gap-4"
        >
          <img
            src={item.product.ImageURL}
            alt={item.product.ProductName}
            width={80}
            height={80}
            className="rounded-md"
          />
          <span>{item.product.ProductName}</span>
        </Link>
      </TableCell>
      <TableCell>{formatCurrency(price)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <button
            className="px-4 py-2 w-10 hover:bg-primary dark:hover:text-white rounded-l-lg border border-primary"
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
            pattern="[1-9][0-9]*"
            value={item.Quantity === 0 ? "" : item.Quantity}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              const newQuantity = rawValue === "" ? 0 : parseInt(rawValue, 10);
              updateQuantity(item.ProductID, newQuantity);
            }}
            onBlur={() => {
              if (item.Quantity < 1) {
                updateQuantity(item.ProductID, 1);
              }
            }}
            className="px-2 py-2 font-semibold dark:bg-white/5 border border-y-primary w-12 text-center"
          />
          <button
            className="px-4 py-2 w-10 hover:bg-primary dark:hover:text-white rounded-r-lg border border-primary"
            onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}
          >
            +
          </button>
        </div>
      </TableCell>
      <TableCell>
        {formatCurrency(item.product.SalePrice * item.Quantity)}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.ProductID)}
        >
          <X />
        </Button>
      </TableCell>
    </TableRow>
  );
}
