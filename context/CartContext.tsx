"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CartItem,
  subscribeToCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateCartQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/lib/db/cart";
import { Product } from "@/lib/db/products";
import toast from "react-hot-toast";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Real-time cart synchronization
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    setLoading(true);

    // Subscribe to real-time cart updates
    const unsubscribe = subscribeToCart(user.uid, (cartItems) => {
      setCart(cartItems);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await apiAddToCart(user.uid, product);
      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) return; // Prevent invalid quantity

    try {
      await apiUpdateCartQuantity(user.uid, productId, quantity);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      await apiRemoveFromCart(user.uid, productId);
      toast.success("Removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await apiClearCart(user.uid);
      toast.success("Cart cleared");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear cart");
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
