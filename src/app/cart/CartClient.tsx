"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

const TAX_RATE = 0.1; // 10% tax

export default function CartClient() {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const {
    items,
    updateQuantity: updateStoreQuantity,
    removeFromCart,
    clearCart: clearStoreCart,
  } = useCartStore();
  const [discount, setDiscount] = useState(0);

  const router = useRouter();

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.SalePrice * item.Quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax - discount;

  const cart = {
    items,
    subtotal,
    tax,
    discount,
    total,
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    startTransition(() => {
      updateStoreQuantity(id, quantity);
      toast.success(t("cart.toast.quantityUpdated"));
    });
  };

  const removeItem = (id: number) => {
    startTransition(() => {
      removeFromCart(id);
      toast.success(t("cart.toast.itemRemoved"));
    });
  };

  const clearCart = () => {
    startTransition(() => {
      clearStoreCart();
      toast.success(t("cart.toast.cartCleared"));
    });
  };

  const applyPromoCode = (code: string) => {
    // In a real app, you'd validate the code with an API
    if (code === "SAVE10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast.success(t("cart.toast.promoApplied"));
    } else {
      toast.error(t("cart.toast.invalidPromo"));
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 mt-16 sm:mt-20">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("cart.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {t("cart.itemCount", { count: items.length }).replace("{{count}}", items.length.toString())}
        </p>
      </div>
      <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
        <div className="lg:w-8/12 rounded-lg border bg-card text-card-foreground shadow-sm max-h-[400px] sm:max-h-[500px]">
          {/* BODY SCROLL */}
          <div className="overflow-x-auto overflow-y-auto max-h-[350px] sm:max-h-[450px] scrollbar-hide">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-card border-b">
                <TableRow>
                  <TableHead className="w-[40%] sm:w-[50%] text-xs sm:text-sm">{t("cart.table.product")}</TableHead>
                  <TableHead className="w-[15%] sm:w-[12%] text-xs sm:text-sm">{t("cart.table.price")}</TableHead>
                  <TableHead className="w-[25%] sm:w-[20%] text-xs sm:text-sm">{t("cart.table.quantity")}</TableHead>
                  <TableHead className="w-[15%] sm:w-[10%] text-xs sm:text-sm">{t("cart.table.total")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("cart.table.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.CartItemID}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="lg:w-4/12 mt-6 sm:mt-8 lg:mt-0">
          <CartSummary
            cart={cart}
            clearCart={clearCart}
            isPending={isPending}
            applyPromoCode={applyPromoCode}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
