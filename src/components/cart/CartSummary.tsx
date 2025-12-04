import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/contexts/LocaleContext";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Cart } from "@/types/cart";
import { Event } from "@/types/events";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface CartSummaryProps {
  cart: Cart;
  clearCart: () => void;
  isPending: boolean;
  onCheckout: () => void;
  setEventId: (id: number | null) => void;
  setEventDiscount: (discount: number | null) => void;
  eventList: Event[];
}

export default function CartSummary({
  cart,
  clearCart,
  isPending,
  onCheckout,
  setEventId,
  setEventDiscount,
  eventList,
}: CartSummaryProps) {
  const { t } = useLocale();
  const eventId = useCartStore((state) => state.eventId);

  // Định nghĩa giới hạn tối đa
  const MAX_ORDER_VALUE = 1000000000;
  const isOverLimit = cart.subtotal > MAX_ORDER_VALUE;

  const handleEventChange = (eventID: string) => {
    const selectedEvent = eventList.find(
      (event) => event.EventID.toString() === eventID
    );
    if (selectedEvent) {
      if (cart.subtotal >= selectedEvent.MinimumValue) {
        setEventId(selectedEvent.EventID);
        setEventDiscount(selectedEvent.DiscountValue);
      } else {
        setEventId(null);
        setEventDiscount(null);
        toast({
          title: t("cart.toast.eventMinimumValueNotMet")
            .replace("{{eventName}}", selectedEvent.EventName)
            .replace(
              "{{minValue}}",
              formatCurrency(selectedEvent.MinimumValue)
            ),
          variant: "warning",
        });
      }
    } else {
      setEventId(null);
      setEventDiscount(null);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-1/3 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{t("cart.summary.title")}</h2>
      </div>
      <div className="p-6">
        <div className="flex justify-between">
          <span>{t("cart.summary.subtotal")}</span>
          <span className={isOverLimit ? "text-destructive font-bold" : ""}>
            {formatCurrency(cart.subtotal)}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <span>{t("cart.summary.membershipDiscount")}</span>
          <span>
            -
            {formatCurrency(
              cart.subtotal *
                (cart.membershipDiscounts?.[cart.userTier || ""] || 0)
            )}
          </span>
        </div>
        <div className="mt-4 flex justify-between">
          <span>
            {t("cart.summary.eventDiscount")} - {cart.eventDiscount}%
          </span>
          <span>
            -
            {formatCurrency(
              ((cart.eventDiscount || 0) / 100) * cart.subtotal || 0
            )}
          </span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>{t("cart.summary.total")}</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            {t("cart.summary.selectEvent")}
          </label>
          <Select
            onValueChange={handleEventChange}
            disabled={isPending}
            value={eventId?.toString() ?? "none"}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("cart.summary.selectEvent")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("cart.summary.noEvent")}</SelectItem>
              {eventList.map((event) => (
                <SelectItem
                  key={event.EventID}
                  value={event.EventID.toString()}
                  disabled={cart.subtotal < event.MinimumValue}
                >
                  {event.EventName}
                  {event.MinimumValue > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {t("cart.summary.requires").replace(
                        "{{minValue}}",
                        formatCurrency(event.MinimumValue)
                      )}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6">
        {/* Phần thông báo lỗi khi vượt quá giới hạn */}
        {isOverLimit && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive dark:bg-destructive/25">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="font-medium">
              {`Orders cannot exceed ${formatCurrency(MAX_ORDER_VALUE)}`}
            </span>
          </div>
        )}

        <Button
          className="w-full"
          disabled={isPending || cart.items.length === 0 || isOverLimit}
          onClick={onCheckout}
        >
          {t("cart.summary.checkout")}
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={clearCart}
          disabled={isPending || cart.items.length === 0}
        >
          {t("cart.summary.clearCart")}
        </Button>
      </div>
    </div>
  );
}
