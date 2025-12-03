"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Truck,
  QrCode,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  Lock,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

// Services
import { getCartItems } from "@/services/cart/api";
import { getProfile, getUserAddress } from "@/services/profile/api";
import { checkout, CheckoutPayload } from "@/services/checkout/api";
// Types & Utils
import { CartItem } from "@/types/cart";
import { UserAddress } from "@/types/profile";
import { formatCurrency } from "@/lib/utils";
import {
  getRecommendedProducts,
  RecommendedProduct,
} from "@/services/recommendation/api";
import { useCartStore } from "@/store/cart";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useForm } from "react-hook-form";
import {
  ShippingFormValues,
  ShippingSchema,
} from "@/validations/checkout/shippingFormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const PAYMENT_METHODS = {
  COD: 1,
  VNPAY: 2,
};

export default function CheckoutPage() {
  const { t } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setItems: setCartItemsInStore } = useCartStore();

  // State
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);

  const [eventInfo, setEventInfo] = useState<{
    id: number | null;
    discount: number;
  }>({
    id: null,
    discount: 0,
  });

  // react-hook-form + zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      userName: "",
      email: "",
      address: "",
      city: "",
      phone: "",
    },
  });

  // prefill eventInfo from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartStorageStr = localStorage.getItem("cart-storage");
      if (cartStorageStr) {
        try {
          const cartStorage = JSON.parse(cartStorageStr);
          setEventInfo({
            id: cartStorage.state?.eventId || null,
            discount: cartStorage.state?.eventDiscount || 0,
          });
        } catch (e) {
          console.error("Error parsing cart storage", e);
        }
      }
    }
  }, []);

  // 2. Data Fetching
  const results = useQueries({
    queries: [
      { queryKey: ["cart"], queryFn: getCartItems },
      { queryKey: ["profile"], queryFn: getProfile },
      { queryKey: ["address"], queryFn: getUserAddress },
    ],
  });

  const [cartResult, profileResult, addressResult] = results;
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = cartResult;
  const {
    data: userProfileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = profileResult;
  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = addressResult;

  // Prefill values from profile
  useEffect(() => {
    if (userProfileData?.success) {
      const user = userProfileData.data;
      if (user.UserName) setValue("userName", user.UserName);
      if (user.Email) setValue("email", user.Email);
      if (user.PhoneNumber) setValue("phone", user.PhoneNumber);
    }
  }, [userProfileData, setValue]);

  // Prefill default address if present
  useEffect(() => {
    if (addressData?.success && addressData.data.length > 0) {
      const addresses: UserAddress[] = addressData.data;
      const defaultAddr = addresses.find((addr) => addr.IsDefault);
      if (defaultAddr) {
        setValue("address", defaultAddr.StreetAddress || "");
        setValue(
          "city",
          `${defaultAddr.Ward}, ${defaultAddr.District}, ${defaultAddr.Province}`
        );
      }
    }
  }, [addressData, setValue]);

  // onSubmit uses validated values
  const onSubmit = handleSubmit(async (values: ShippingFormValues) => {
    // ensure cart and profile data exist
    if (!cartData?.data || !userProfileData?.data) {
      toast({
        title: "Session Error",
        description: "Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    // Safer parsing of City/Ward/District
    const cityParts = values.city.split(",").map((s) => s.trim());
    const orderWard = cityParts[0] || "";
    const orderProvince = cityParts[cityParts.length - 1] || "";
    const orderDistrict =
      cityParts.length >= 3
        ? cityParts[1]
        : cityParts.length === 2
          ? cityParts[0]
          : "";

    // Dynamic Return URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const returnUrl = `${baseUrl}/payment/return`;

    const payload: CheckoutPayload = {
      UserName: values.userName,
      Email: userProfileData.data.Email,
      PhoneNumber: values.phone,
      OrderStreetAddress: values.address,
      OrderWard: orderWard,
      OrderDistrict: orderDistrict,
      OrderProvince: orderProvince,
      Items: cartData.data.items.map((item: CartItem) => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
      })),
      EventID: eventInfo.id,
      PaymentMethodID:
        paymentMethod === "cod" ? PAYMENT_METHODS.COD : PAYMENT_METHODS.VNPAY,
      ReturnUrl: returnUrl,
    };

    try {
      const response = await checkout(payload);

      if (response.success) {
        // --- VNPAY ---
        if (paymentMethod === "vnpay" && response.data?.paymentUrl) {
          toast({ title: "Redirecting to Payment Gateway..." });
          window.location.href = response.data.paymentUrl;
          return;
        }

        // --- COD ---
        toast({
          title: "Order Placed Successfully!",
          description: "Generating personalized recommendations...",
        });

        // Background updates
        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        // Update Zustand
        getCartItems().then((res) => {
          if (res.success) setCartItemsInStore(res.data.items);
        });

        setIsCheckingOut(false);
        setIsRecommendationLoading(true);

        try {
          const recommendations = await getRecommendedProducts(response);
          if (recommendations?.length > 0) {
            setRecommendedProducts(recommendations);
          }
        } catch (recError) {
          console.error("Failed to load recommendations", recError);
        } finally {
          setIsRecommendationLoading(false);
        }
      } else {
        throw new Error(response.message || "Checkout failed");
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      toast({
        title: "Checkout Failed",
        description:
          err.message || "Please check your information and try again.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  });

  // --- Render Logic ---
  if (isCartLoading || isProfileLoading || isAddressLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const hasError =
    isCartError ||
    isProfileError ||
    !cartData?.success ||
    !userProfileData?.success;
  const cartItems: CartItem[] = cartData?.data?.items ?? [];

  if (hasError || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-30 text-center mt-20">
        <h2 className="text-2xl font-bold">
          {hasError
            ? "An Error Occurred - You must be login first!"
            : "Your Cart is Empty"}
        </h2>
        <Button className="mt-4 mr-10" onClick={() => router.push("/products")}>
          Back to Shop
        </Button>
        <Button className="mt-8" onClick={() => router.push("/profile")}>
          Go to Profile
        </Button>
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Recommended for you</h3>
        </div>
        {isRecommendationLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {recommendedProducts.length > 0 && (
          <div className="mt-10">
            <Carousel className="w-full">
              <CarouselContent>
                {recommendedProducts.map((product) => (
                  <CarouselItem
                    key={product.product_id}
                    className="basis-1/2 md:basis-1/4"
                  >
                    <div
                      className="border dark:border-white/20 rounded-lg p-4 hover:shadow transition cursor-pointer h-full"
                      onClick={() =>
                        router.push(`/products/${product.product_id}`)
                      }
                    >
                      <img
                        src={product.img_link}
                        alt={product.name}
                        className="w-full h-32 object-contain"
                      />
                      <h4 className="text-sm font-medium mt-2 line-clamp-1">
                        {product.name}
                      </h4>
                      <span>
                        {formatCurrency(
                          product.price * 1 - product.discount_value / 100
                        )}{" "}
                        -{" "}
                      </span>
                      <span className="line-through text-gray-500">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
    );
  }

  // Calculations
  const subtotal = cartItems.reduce(
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

  const userTier = profileResult.data?.data.TierName || "Bronze";
  const tierDiscountRate = membershipDiscounts[userTier] || 0;

  // Calculate discount amounts clearly
  const tierDiscountAmount = subtotal * tierDiscountRate;
  const eventDiscountAmount = subtotal * ((eventInfo.discount || 0) / 100);

  const total = Math.max(
    0,
    subtotal - tierDiscountAmount - eventDiscountAmount
  );

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-background mt-10">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent text-muted-foreground hover:text-primary"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-2">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Information
              </CardTitle>
              <CardDescription>Enter your delivery address.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Customer Name</Label>
                <Input
                  id="userName"
                  placeholder="John Doe"
                  {...register("userName")}
                />
                {errors.userName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Wine St"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City/Province</Label>
                  <Input
                    id="city"
                    placeholder="Ward, District, Province"
                    {...register("city")}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Format: Ward, District, Province
                  </p>
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+84..."
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as any)}
                className="grid gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="cod"
                    id="cod"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="cod"
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <span className="font-semibold">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="vnpay"
                    id="vnpay"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="vnpay"
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      <span className="font-semibold">Thanh toán VNPay</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <Card className="sticky top-8 bg-muted/30 border-muted">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.CartItemID}
                    className="flex items-center gap-4"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-background shrink-0">
                      <img
                        src={item.product.ImageURL || "/fallback-image.jpg"}
                        alt={item.product.ProductName}
                        className="object-contain h-full w-full"
                      />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <h4 className="text-sm font-medium leading-none line-clamp-1">
                        {item.product.ProductName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.Quantity}
                      </p>
                    </div>
                    <div className="font-medium text-sm whitespace-nowrap">
                      {formatCurrency(item.product.SalePrice * item.Quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-muted-foreground">
                    {t("cart.summary.membershipDiscount")} ({userTier})
                  </span>
                  <span className="text-primary">
                    - {formatCurrency(tierDiscountAmount)}
                  </span>
                </div>
                {eventInfo.discount > 0 && (
                  <div className="mt-4 flex justify-between">
                    <span className="text-muted-foreground">
                      {t("cart.summary.eventDiscount")} ({eventInfo.discount}%)
                    </span>
                    <span className="text-primary">
                      - {formatCurrency(eventDiscountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center font-bold">
                <span className="text-base">Total</span>
                <span className="text-xl text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full py-6 text-lg shadow-lg"
                size="lg"
                onClick={onSubmit}
                disabled={isCheckingOut || isSubmitting}
              >
                {isCheckingOut || isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {isCheckingOut || isSubmitting
                  ? "Processing..."
                  : `Place Order (${formatCurrency(total)})`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" /> Secure & Encrypted Checkout
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
