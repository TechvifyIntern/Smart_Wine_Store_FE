import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types/cart";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

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
  const { t } = useLocale();
  const [promoCode, setPromoCode] = useState("");
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-1/3 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold">{t("cart.summary.title")}</h2>
      </div>
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex justify-between text-sm sm:text-base">
          <span>{t("cart.summary.subtotal")}</span>
          <span>{formatCurrency(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>{t("cart.summary.discount")}</span>
          <span>-{formatCurrency(cart.discount)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>{t("cart.summary.tax")}</span>
          <span>{formatCurrency(cart.tax)}</span>
        </div>
        <Separator className="my-3 sm:my-4" />
        <div className="flex justify-between font-semibold text-sm sm:text-base">
          <span>{t("cart.summary.total")}</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2">
          <Label htmlFor="promo" className="text-sm">{t("cart.summary.promoCode")}</Label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              className="border-white/20 text-sm"
              id="promo"
              placeholder={t("cart.summary.promoPlaceholder")}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isPending}
            />
            <Button
              className="text-sm whitespace-nowrap"
              onClick={() => applyPromoCode(promoCode)}
              disabled={isPending || !promoCode}
            >
              {t("cart.summary.applyButton")}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-2">
        <Button className="w-full text-sm sm:text-base" disabled={isPending} onClick={onCheckout}>
          {t("cart.summary.checkoutButton")}
        </Button>
        <Button
          variant="outline"
          className="w-full text-sm sm:text-base"
          onClick={clearCart}
          disabled={isPending}
        >
          {t("cart.summary.clearCartButton")}
        </Button>
      </div>
    </div>
  );
}
