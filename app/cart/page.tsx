"use client";

import { CartItem as CartItemComponent } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";
import {
  validateCart,
  calculateCartTotals,
  MAX_CART_QUANTITY,
} from "@/lib/cart";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    cart: items,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  const handleClearCartClick = () => {
    setIsClearCartModalOpen(true);
  };

  const confirmClearCart = async () => {
    await clearCart();
    setIsClearCartModalOpen(false);
    toast.success("Cart cleared successfully");
  };

  const totals = calculateCartTotals(items);
  const validation = validateCart(items);

  // Show validation warnings if any
  // Using useEffect or just rendering them? Rendering is safer.

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

      {/* Validation Warnings */}
      {!validation.valid && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800">
          <h4 className="font-semibold mb-2">
            Please fix the following issues:
          </h4>
          <ul className="list-disc list-inside text-sm">
            {validation.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Summary */}
        <CartSummary
          totals={totals}
          onClearCart={handleClearCartClick}
          loading={cartLoading}
        />
      </div>

      <ConfirmationModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmLabel="Clear Cart"
        variant="danger"
        loading={cartLoading}
      />
    </div>
  );
}
