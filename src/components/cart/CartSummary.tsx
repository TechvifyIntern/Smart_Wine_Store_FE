import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types/cart";
import { useState } from "react";

interface CartSummaryProps {
  cart: Cart;
  clearCart: () => void;
  isPending: boolean;
  applyPromoCode: (code: string) => void;
  onCheckout: () => void; // New prop for checkout action
}

export default function CartSummary({
  cart,
  clearCart,
  isPending,
  applyPromoCode,
  onCheckout, // Destructure new prop
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-1/3 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>
      <div className="p-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(cart.subtotal)}</span>
        </div>
        <div className="mt-4 flex justify-between">
          <span>Discount</span>
          <span>-{formatCurrency(cart.discount)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
      </div>
      {/* <div className="p-6">
        <div className="grid gap-2">
          <Label htmlFor="promo">Promo Code</Label>
          <div className="flex space-x-2">
            <Input
              className="border-white/20"
              id="promo"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isPending}
            />
            <Button
              onClick={() => applyPromoCode(promoCode)}
              disabled={isPending || !promoCode}
            >
              Apply
            </Button>
          </div>
        </div>
      </div> */}
      <div className="p-6">
        <Button className="w-full" disabled={isPending} onClick={onCheckout}>
          Checkout
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={clearCart}
          disabled={isPending}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
