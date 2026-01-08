"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getUserProfile } from "@/lib/firebase/index";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/firebase/orders";
import { checkoutSchema } from "@/lib/checkoutSchema";
import { calculateCartTotals } from "@/lib/cart";

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string | null | undefined;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    displayName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
    country: "",
    email: "",
  });

  // Calculate totals
  const shipping = 0; // Free shipping
  const { subtotal, tax, total } = calculateCartTotals(cart);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile(user.uid);
        if (profileData) {
          setAddress({ ...address, ...profileData.address, ...profileData });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  function containsOnlyDigits(str: string): boolean {
    return /^\d+$/.test(str);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!user) return;

    try {
      checkoutSchema.parse(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Create Order via API
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      const order = await res.json();

      if (!order || !order.id) {
        throw new Error("Failed to create order");
      }

      // 2. Open Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        image: "https://i.ibb.co/7NQm7JLG/Dev-Studios.png",
        name: "CommerceOS",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            toast.loading("Verifying payment...");

            const verifyPaymentRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyPaymentData = await verifyPaymentRes.json();

            toast.dismiss();

            if (!verifyPaymentData.success) {
              toast.error("Payment verification failed!");
              return;
            }

            toast.loading("Placing order...");
            const firestoreOrder = await createOrder(user.uid, {
              items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: item.category,
              })),
              deliveryAddress: {
                fullName: address.displayName,
                phone: address.phoneNumber,
                addressLine1: address.line1,
                addressLine2: address.line2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country,
              },
              priceBreakdown: {
                subtotal,
                tax,
                shipping,
                total,
              },
              paymentMethod:
                verifyPaymentData.payment.method?.toUpperCase() || "RAZORPAY",
              razorpayDetails: {
                paymentId: verifyPaymentData.payment.id,
                orderId: verifyPaymentData.payment.order_id,
                signature: response.razorpay_signature,
                method:
                  verifyPaymentData.payment.method?.toUpperCase() || "RAZORPAY",
                amount: total,
              },
              status: "booked",
            });

            toast.success("Order placed successfully!");

            // Clear cart
            await clearCart();

            toast.dismiss();

            // Redirect to order confirmation page
            router.push(`/order-confirmed/${firestoreOrder.orderId}`);
          } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Failed to create order. Please contact support.");
          }
        },
        prefill: {
          name: address.displayName,
          email: user.email,
          contact: address.phoneNumber,
        },
        theme: {
          color: "#6D28D9", // Primary color
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed or cancelled");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!user) {
    router.push("/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/products")}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Shipping Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={address.displayName}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                placeholder="Email Address"
                value={address.email}
                onChange={handleInputChange}
              />
              <Input
                name="street"
                placeholder="Street Address"
                value={address.line1}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleInputChange}
                />
                <Input
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="zip"
                  placeholder="ZIP Code"
                  value={address.pincode}
                  onChange={handleInputChange}
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex justify-between w-full text-xl font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Pay {formatPrice(total)}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
