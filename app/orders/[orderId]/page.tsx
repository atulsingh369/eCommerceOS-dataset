"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeToOrder, Order } from "@/lib/firebase/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Loader2, ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Timestamp } from "firebase/firestore";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  const orderDate =
    order.createdAt instanceof Timestamp
      ? order.createdAt.toDate()
      : new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <p className="text-muted-foreground">
              Order ID: <span className="font-mono">{order.orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {orderDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="w-fit" />
        </div>
      </div>

      {/* Order Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline currentStatus={order.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.category}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-semibold">
                  {order.deliveryAddress.fullName}
                </p>
                <p className="text-sm">{order.deliveryAddress.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress.addressLine1}
                </p>
                {order.deliveryAddress.addressLine2 && (
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress.country}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.priceBreakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.priceBreakdown.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.priceBreakdown.shipping === 0
                    ? "FREE"
                    : formatPrice(order.priceBreakdown.shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.priceBreakdown.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              {order.razorpayDetails && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="font-mono text-xs">
                      {order.razorpayDetails.paymentId.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Status
                    </span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
