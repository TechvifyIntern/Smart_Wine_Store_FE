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
import { RecommendationModal } from "@/components/checkout/RecommendationModal";

const PAYMENT_METHODS = {
  COD: 1,
  VNPAY: 2,
};

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setItems: setCartItemsInStore } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  // Loading state cho quá trình checkout
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  // Loading state cho quá trình gọi API gợi ý sản phẩm
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

  // State cho phần gợi ý sản phẩm (Upsell)
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);

  const results = useQueries({
    queries: [
      { queryKey: ["cart"], queryFn: getCartItems },
      { queryKey: ["profile"], queryFn: getProfile },
      { queryKey: ["address"], queryFn: getUserAddress },
    ],
  });

  const cartResult = results[0];
  const profileResult = results[1];
  const addressResult = results[2];

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

  const [shippingForm, setShippingForm] = useState({
    userName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  // Load User Info
  useEffect(() => {
    if (userProfileData?.success) {
      const user = userProfileData.data;
      setShippingForm((prev) => ({
        ...prev,
        userName: prev.userName || user.UserName,
        email: prev.email || user.Email,
        phone: prev.phone || user.PhoneNumber,
      }));
    }
  }, [userProfileData]);

  // Load Address Info
  useEffect(() => {
    if (addressData?.success && addressData.data.length > 0) {
      const addresses: UserAddress[] = addressData.data;
      const defaultAddr = addresses.find((addr) => addr.IsDefault);
      if (defaultAddr) {
        setShippingForm((prev) => ({
          ...prev,
          address: defaultAddr.StreetAddress,
          city: `${defaultAddr.Ward}, ${defaultAddr.Province}`,
        }));
      }
    }
  }, [addressData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async () => {
    // 1. Validate Form
    const { userName, address, city, phone } = shippingForm;
    if (!userName || !address || !city || !phone) {
      toast({
        title: "Missing Information",
        description:
          "Please fill out all shipping fields before placing your order.",
        variant: "destructive",
      });
      return;
    }

    if (!cartData?.data || !userProfileData?.data) {
      toast({
        title: "Error",
        description: "Your session might have expired. Please refresh.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    const cityParts = shippingForm.city.split(",").map((s) => s.trim());
    const orderWard = cityParts[0] || "";
    // Giả định format là: Phường, Quận, Tỉnh. Nếu chỉ có 2 phần tử thì xử lý linh hoạt
    const orderDistrict = cityParts.length > 2 ? cityParts[1] : "";
    const orderProvince = cityParts[cityParts.length - 1] || "";

    const payload: CheckoutPayload = {
      UserName: shippingForm.userName,
      Email: userProfileData.data.Email,
      PhoneNumber: shippingForm.phone,
      OrderStreetAddress: shippingForm.address,
      OrderWard: orderWard,
      OrderDistrict: orderDistrict,
      OrderProvince: orderProvince,
      Items: cartData.data.items.map((item: CartItem) => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
      })),
      DiscountID: cartData.data.discountId || null,
      PaymentMethodID:
        paymentMethod === "cod" ? PAYMENT_METHODS.COD : PAYMENT_METHODS.VNPAY,
      ReturnUrl:
        `${process.env.BE_API_URL}/payment/return` ||
        "http://localhost:3000/payment/return",
    };

    // 3. Call API Checkout
    try {
      const response = await checkout(payload);

      if (response.success) {
        // --- CASE VNPay: Redirect ngay ---
        if (paymentMethod === "vnpay" && response.data?.ReturnUrl) {
          toast({ title: "Redirecting to Payment Gateway..." });
          window.location.href = response.data.ReturnUrl;
          return;
        }

        // --- CASE COD: Call Recommendation API ---
        toast({
          title: "Order Placed Successfully!",
          description: "Generating personalized recommendations...",
        });

        // 1. Invalidate cart to refresh it (for react-query)
        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        // 2. Fetch the updated cart items and update the Zustand store
        const updatedCartResponse = await getCartItems();
        if (updatedCartResponse.success) {
          setCartItemsInStore(updatedCartResponse.data.items);
        } else {
          console.error("Failed to fetch updated cart for Zustand store.");
        }

        // 2. Stop checkout loading, start recommendation loading, and show modal
        setIsCheckingOut(false);
        setIsRecommendationLoading(true);
        setShowRecommendation(true); // Show modal immediately with loading state

        // 3. Call API gợi ý với toàn bộ data trả về từ checkout
        try {
          const recommendations = await getRecommendedProducts(response);

          if (recommendations && recommendations.length > 0) {
            setRecommendedProducts(recommendations);
            setIsRecommendationLoading(false); // Stop loading after data is set
          } else {
            // No recommendations -> stop loading, but keep modal open so user can close it manually.
            setIsRecommendationLoading(false);
            // Optionally, you might decide to immediately redirect if there are absolutely no recommendations,
            // but for now, we'll let the user close the empty/loading modal.
          }
        } catch (recError) {
          console.error("Failed to load recommendations", recError);
          // If recommendations fail, stop loading, but keep modal open for user to close.
          setIsRecommendationLoading(false);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      toast({
        title: "Checkout Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsCheckingOut(false); // Ensure loading is off on error
    }
  };

  // Hàm xử lý khi đóng Modal
  const handleCloseRecommendation = () => {
    setShowRecommendation(false);
    // Always redirect to profile/order history when modal is explicitly closed by user
    router.push("/profile");
  };

  // --- Render Loading / Error States ---
  if (isCartLoading || isProfileLoading || isAddressLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const error =
    isCartError ||
    isProfileError ||
    isAddressError ||
    !cartData?.success ||
    !userProfileData?.success;
  const cartItems: CartItem[] = cartData?.data?.items ?? [];

  if (error || !cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-30 text-center">
        <h2 className="text-2xl font-bold">
          {error ? "An Error Occurred" : "Your Cart is Empty"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {error
            ? "Failed to load checkout data."
            : "Add some wine to your cart before proceeding."}
        </p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Back to Shop
        </Button>

        <RecommendationModal
          isOpen={showRecommendation}
          onClose={handleCloseRecommendation}
          products={recommendedProducts}
          isLoading={isRecommendationLoading}
        />
      </div>
    );
  }

  // --- Calculation Logic ---
  const calculatedSubtotal = cartItems.reduce(
    (acc: number, item: CartItem) =>
      acc + item.product.SalePrice * item.Quantity,
    0
  );
  const discount = cartData?.data?.discount || 0;
  const finalTotal = calculatedSubtotal - discount;

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
          {/* Shipping Info Card */}
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
                  value={shippingForm.userName}
                  onChange={handleInputChange}
                  className="dark:border-white/20"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Wine St..."
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  className="dark:border-white/20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City/Province</Label>
                  <Input
                    id="city"
                    placeholder="Ward, District, Province"
                    value={shippingForm.city}
                    onChange={handleInputChange}
                    className="dark:border-white/20"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Format: Ward, District, Province
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+84123456789"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    className="dark:border-white/20"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </CardTitle>
              <CardDescription>
                All transactions are secure and encrypted.
              </CardDescription>
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
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
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
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
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
              <CardDescription>
                Review your items before checkout.
              </CardDescription>
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
                  <span>{formatCurrency(calculatedSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="">Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center font-bold">
                <span className="text-base">Total</span>
                <span className="text-xl text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full py-6 text-lg shadow-lg"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {isCheckingOut
                  ? "Processing..."
                  : `Place Order (${formatCurrency(finalTotal)})`}
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
