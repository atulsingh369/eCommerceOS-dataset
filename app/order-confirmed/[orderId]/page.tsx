"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeToOrder, Order } from "@/lib/firebase/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function OrderConfirmedPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Subscribe to real-time order updates
    const unsubscribe = subscribeToOrder(user.uid, orderId, (orderData) => {
      setOrder(orderData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, authLoading, orderId, router]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!order || loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, loading]);

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/orders/${orderId}`);
    }
  }, [countdown, router, orderId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Link href="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <CheckCircle className="h-20 w-20 text-green-500 relative" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="font-mono font-medium">{order.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Items</span>
            <span className="font-medium">{order.items.length} item(s)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold">
              {formatPrice(order.priceBreakdown.total)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Payment Method
            </span>
            <span className="font-medium capitalize">
              {order.paymentMethod}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Link href={`/orders/${orderId}`}>
          <Button size="lg" className="w-full">
            View Order Details
          </Button>
        </Link>

        <div className="text-center text-sm text-muted-foreground">
          Redirecting to order details in {countdown} second
          {countdown !== 1 ? "s" : ""}...
        </div>

        <Link href="/products">
          <Button variant="outline" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
