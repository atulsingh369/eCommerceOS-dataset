"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { calculateCartTotals } from "@/lib/cart";
import { MAX_CART_QUANTITY } from "@/lib/constants";
import toast from "react-hot-toast";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    cart: items,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity > MAX_CART_QUANTITY) {
      toast.error(`Maximum limit of ${MAX_CART_QUANTITY} items reached`);
      return;
    }
    await updateQuantity(id, newQuantity);
  };

  const handleRemove = async (id: string) => {
    await removeFromCart(id);
  };

  const { subtotal, tax, total } = calculateCartTotals(items);

  if (authLoading || cartLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Please Log In</h1>
        <p className="text-muted-foreground">
          You need to be logged in to view your cart.
        </p>
        <Link href="/login">
          <Button size="lg" className="mt-4">
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="relative w-64 h-64 opacity-80">
            <Image
              src="https://illustrations.popsy.co/amber/surr-shopping-cart.svg"
              alt="Empty Cart"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Your cart feels lonely
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          It looks like you haven&apos;t added any items yet. Explore our
          collection to find something you love.
        </p>
        <Link href="/products">
          <Button size="lg" className="mt-4 px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-6 py-6 border-b">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-lg leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-96">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes (Est.)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="text-xs text-center text-muted-foreground">
                Secure Checkout powered by Razorpay
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
