"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToUserOrders,
  Order,
  OrderStatus,
} from "@/lib/firebase/orders";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Timestamp } from "firebase/firestore";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 6;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login?redirect=/orders");
      return;
    }

    // Subscribe to real-time orders updates
    const unsubscribe = subscribeToUserOrders(user.uid, (ordersData) => {
      setOrders(ordersData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, authLoading, router]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter orders by status
  const allFilteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  // Pagination logic
  const totalOrders = allFilteredOrders.length;
  const totalPages = Math.ceil(totalOrders / LIMIT);
  const startIndex = (currentPage - 1) * LIMIT;
  const endIndex = startIndex + LIMIT;
  const filteredOrders = allFilteredOrders.slice(startIndex, endIndex);
  const hasMore = currentPage < totalPages;

  const statusTabs: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "booked", label: "Booked" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            {orders.length > 0 && (
              <p className="text-muted-foreground">
                {totalOrders} order{totalOrders !== 1 ? "s" : ""} in total
              </p>
            )}
          </div>
          {/* Only show page number if there are multiple pages */}
          {(currentPage > 1 || hasMore) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      {orders.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}

      {/* Orders Grid */}
      {orders.length < 1 ? (
        <div className="text-center py-20">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {statusFilter === "all"
              ? "No orders yet"
              : `No ${statusFilter} orders`}
          </h2>
          <p className="text-muted-foreground mb-6">
            {statusFilter === "all"
              ? "Start shopping to see your orders here"
              : `You don't have any ${statusFilter} orders`}
          </p>
          {statusFilter === "all" ? (
            <Link href="/products">
              <Button size="lg">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => setStatusFilter("all")}>
              View All Orders
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => {
            // Safety checks
            if (
              !order ||
              !order.orderId ||
              !order.items ||
              order.items.length === 0
            ) {
              return null;
            }

            const orderDate =
              order.createdAt instanceof Timestamp
                ? order.createdAt.toDate()
                : new Date();
            const firstItem = order.items[0];

            return (
              <Link key={order.orderId} href={`/orders/${order.orderId}`}>
                <Card className="mx-2 md:mx-0 group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-row md:flex-col border-2 hover:border-primary/50">
                  {/* Image Container */}
                  <div className="relative h-auto overflow-hidden w-[140px] md:aspect-video md:w-full bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
                    {firstItem?.image ? (
                      <>
                        <Image
                          src={firstItem.image}
                          alt={firstItem.name || "Product"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 140px, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                      </div>
                    )}
                    {order.items.length > 1 && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                        +{order.items.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] md:text-xs text-muted-foreground mb-1 truncate">
                          {order.orderId}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                          <span className="hidden md:inline">Ordered on</span>
                          {orderDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {order.status && (
                        <OrderStatusBadge
                          status={order.status}
                          className="text-[10px] md:text-xs flex-shrink-0"
                        />
                      )}
                    </div>

                    <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-2 md:mb-3 group-hover:text-primary transition-colors">
                      {firstItem?.name || "Product"}
                      {order.items.length > 1 &&
                        ` & ${order.items.length - 1} more`}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Total Amount
                        </p>
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {formatPrice(order.priceBreakdown?.total || 0)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 hidden md:flex"
                      >
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination - Only show if there are multiple pages */}
      {totalOrders > 0 && (currentPage > 1 || hasMore) && (
        <div className="flex justify-center mt-12 space-x-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
