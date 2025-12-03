"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useQuery } from "@tanstack/react-query";
import { getAvailableEvents } from "@/services/event/api";
import { getProfile } from "@/services/profile/api";
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CartClient() {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleBackToShop = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      router.push("/products");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    items,
    updateQuantity: updateStoreQuantity,
    removeFromCart,
    clearCart: clearStoreCart,
    eventDiscount,
    setEventId,
    setEventDiscount,
    isUpdating,
  } = useCartStore();

  const router = useRouter();

  const { data: eventsData } = useQuery({
    queryKey: ["availableEvents"],
    queryFn: getAvailableEvents,
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const eventList: Event[] = eventsData?.data || [];
  const userTier = profileData?.data?.TierName || "Bronze";

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      item.product.SalePrice *
        (1 - item.product.DiscountValue / 100) *
        item.Quantity,
    0
  );
  const membershipDiscounts: Record<string, number> = {
    Bronze: 0,
    Silver: 0.05,
    Gold: 0.1,
  };

  const total = Math.max(
    0,
    subtotal -
      subtotal * membershipDiscounts[userTier] -
      (((eventDiscount ?? 0) / 100) * subtotal || 0)
  );

  const cart = {
    items,
    subtotal,
    total,
    membershipDiscounts,
    eventDiscount: eventDiscount || 0,
    discount: 0,
    userTier,
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    updateStoreQuantity(id, quantity);
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
  };

  const clearCart = () => {
    clearStoreCart();
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 mt-16 sm:mt-20">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("cart.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {t("cart.itemCount").replace("{{count}}", items.length.toString())}
        </p>
      </div>
      <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
        <div className="lg:w-8/12 rounded-lg border bg-card text-card-foreground shadow-sm max-h-[400px] sm:max-h-[500px]">
          {/* BODY SCROLL */}
          <div className="overflow-x-auto overflow-y-auto max-h-[350px] sm:max-h-[450px] scrollbar-hide">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-card border-b">
                <TableRow>
                  <TableHead className="w-[40%] sm:w-[50%] text-xs sm:text-sm">
                    {t("cart.table.product")}
                  </TableHead>
                  <TableHead className="w-[15%] sm:w-[12%] text-xs sm:text-sm">
                    {t("cart.table.price")}
                  </TableHead>
                  <TableHead className="w-[25%] sm:w-[20%] text-xs sm:text-sm">
                    {t("cart.table.quantity")}
                  </TableHead>
                  <TableHead className="w-[15%] sm:w-[10%] text-xs sm:text-sm">
                    {t("cart.table.total")}
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">
                    {t("cart.table.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.length === 0 ? (
                  <TableRow className="h-64">
                    <TableCell
                      colSpan={5}
                      className="p-0 bg-transparent hover:bg-none"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <p className="text-sm sm:text-base">Giỏ hàng trống</p>
                        <Button
                          onClick={handleBackToShop}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2"
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          Back to shop
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.items.map((item: any) => (
                    <CartItem
                      key={item.CartItemID}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="lg:w-4/12 mt-6 sm:mt-8 lg:mt-0">
          <CartSummary
            cart={cart}
            clearCart={clearCart}
            isPending={isUpdating}
            setEventId={setEventId}
            setEventDiscount={setEventDiscount}
            eventList={eventList}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
