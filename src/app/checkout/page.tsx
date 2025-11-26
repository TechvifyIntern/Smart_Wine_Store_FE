"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  CreditCard,
  Truck,
  Banknote,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  Lock,
  Loader2, // Icon loading
} from "lucide-react";

// Shadcn UI Components
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
import { Cart } from "@/types/cart";
import { getCartItems } from "@/services/cart/api";
import { getProfile, getUserAddress } from "@/services/profile/api";
import { UserAddress, UserProfile } from "@/types/profile";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cod" | "banking"
  >("card");

  // State quản lý dữ liệu và trạng thái tải
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [shippingForm, setShippingForm] = useState({
    userName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  // --- LOGIC FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartReponse, userProfileResponse, addressResponse] =
          await Promise.all([getCartItems(), getProfile(), getUserAddress()]);

        if (!userProfileResponse.success)
          throw new Error(userProfileResponse.message);
        setUserProfile(userProfileResponse.data);

        if (userProfileResponse) {
          setShippingForm((prev) => ({
            ...prev,
            userName: userProfileResponse.data.UserName,
            email: userProfileResponse.data.Email,
            phone: userProfileResponse.data.PhoneNumber,
          }));
        }

        if (!addressResponse.success) throw new Error(addressResponse.message);
        const addresses: UserAddress[] = addressResponse.data;
        setUserAddresses(cartReponse.data);

        const defaultAddr = addresses.find((addr) => addr.IsDefault);
        if (defaultAddr) {
          setShippingForm((prev) => ({
            ...prev,
            address: defaultAddr.StreetAddress,
            city: `${defaultAddr.Ward}, ${defaultAddr.Province}`,
          }));
        }

        if (!cartReponse.success) throw new Error(cartReponse.message);
        setCartData(cartReponse.data);
      } catch (err: any) {
        console.error("Failed to fetch cart:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [id]: value }));
  };

  // --- RENDER LOADING STATE ---
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- RENDER ERROR OR EMPTY STATE ---
  if (error || !cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground mt-2">
          {error || "Add some wine to your cart first!"}
        </p>
        <Button className="mt-4" onClick={() => router.push("/cart")}>
          Back to Shop
        </Button>
      </div>
    );
  }

  // Tính toán lại subtotal từ items để đảm bảo chính xác (phòng trường hợp BE chưa tính)
  const calculatedSubtotal = cartData.items.reduce(
    (acc, item) => acc + item.product.SalePrice * item.Quantity,
    0
  );

  const shippingFee = calculatedSubtotal * 0.2;
  const tax = calculatedSubtotal * 0.1;
  const discount = cartData.discount || 0;

  const finalTotal = calculatedSubtotal + shippingFee - discount + tax;

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-background mt-10">
      {/* Breadcrumb / Back Button */}
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
        {/* --- LEFT COLUMN: Shipping & Payment --- */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Information
              </CardTitle>
              <CardDescription>Enter your delivery address.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    className="dark:border-white/20"
                    id="name"
                    placeholder="John"
                    value={shippingForm.userName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  className="dark:border-white/20"
                  id="address"
                  placeholder="123 Wine St..."
                  value={shippingForm.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    className="dark:border-white/20"
                    id="city"
                    placeholder="New York"
                    value={shippingForm.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    className="dark:border-white/20"
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Payment Method */}
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
                defaultValue="card"
                onValueChange={(value) => setPaymentMethod(value as any)}
                className="grid gap-4"
              >
                {/* Option: Banking */}
                <div>
                  <RadioGroupItem
                    value="banking"
                    id="banking"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="banking"
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <span className="font-semibold">
                        Bank Transfer (QR Code)
                      </span>
                    </div>
                  </Label>
                </div>

                {/* Option: COD */}
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
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: Order Summary --- */}
        <div className="lg:col-span-5">
          <Card className="sticky top-8 bg-muted/30 border-muted">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
              <CardDescription>
                Review your items before checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Product List */}
              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <div
                    key={item.CartItemID}
                    className="flex items-center gap-4"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-background shrink-0">
                      {/* Xử lý hiển thị ảnh với fallback nếu không có ImageURL */}
                      {item.product.ImageURL ? (
                        <img
                          src={item.product.ImageURL}
                          alt={item.product.ProductName}
                          className="object-fit h-full w-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <h4 className="text-sm font-medium leading-none line-clamp-1">
                        {item.product.ProductName}
                      </h4>
                      {/* Hiển thị Category hoặc Vintage nếu có trong detail */}
                      <p className="text-xs text-muted-foreground">
                        Category: {item.product.CategoryName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Quantity: {item.Quantity}
                      </p>
                    </div>
                    <div className="font-medium text-sm whitespace-nowrap">
                      {formatCurrency(item.product.SalePrice * item.Quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              {/* Calculations */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(calculatedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {cartData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="">Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full py-6 text-lg shadow-lg" size="lg">
                <Lock className="mr-2 h-4 w-4" /> Place Order (
                {formatCurrency(finalTotal)})
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
