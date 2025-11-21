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

const TAX_RATE = 0.1; // 10% tax

export default function CartClient() {
  const [isPending, startTransition] = useTransition();
  const {
    items,
    updateQuantity: updateStoreQuantity,
    removeFromCart,
    clearCart: clearStoreCart,
  } = useCartStore();
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.SalePrice * item.quantity,
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
      toast.success("Quantity updated successfully!");
    });
  };

  const removeItem = (id: number) => {
    startTransition(() => {
      removeFromCart(id);
      toast.success("Item removed from cart.");
    });
  };

  const clearCart = () => {
    startTransition(() => {
      clearStoreCart();
      toast.success("Cart cleared successfully!");
    });
  };

  const applyPromoCode = (code: string) => {
    // In a real app, you'd validate the code with an API
    if (code === "SAVE10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 mt-20">
      <div className="flex flex-col items-center text-center mb-8">
        <ShoppingCart className="h-12 w-12 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="text-muted-foreground mt-2">
          You have {items.length} items in your cart.
        </p>
      </div>
      <div className="mt-8 lg:flex lg:gap-8">
        <div className="lg:w-8/12 rounded-lg border bg-card text-card-foreground shadow-sm max-h-[500px]">
          {/* HEADER STICKY */}
          <div className="sticky top-0 z-20 bg-card border-b">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[49%]">Product</TableHead>
                  <TableHead className="w-[14%]">Price</TableHead>
                  <TableHead className="w-[18%]">Quantity</TableHead>
                  <TableHead className="w-[10%]">Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* BODY SCROLL */}
          <div className="overflow-y-auto max-h-[450px] scrollbar-hide">
            <Table>
              <TableBody>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="lg:w-4/12 mt-8 lg:mt-0">
          <CartSummary
            cart={cart}
            clearCart={clearCart}
            isPending={isPending}
            applyPromoCode={applyPromoCode}
          />
        </div>
      </div>
    </div>
  );
}
