"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/db/products";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAX_CART_QUANTITY } from "@/lib/constants";

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    await addToCart(product);
  };

  const increaseQuantity = async () => {
    if (quantity >= MAX_CART_QUANTITY) {
      toast.error(`Maximum limit of ${MAX_CART_QUANTITY} items reached`);
      return;
    }
    await updateQuantity(product.id, quantity + 1);
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      await updateQuantity(product.id, quantity - 1);
    } else {
      await removeFromCart(product.id);
    }
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-center w-full md:w-auto md:justify-start gap-3">
        <Button size="icon" variant="outline" onClick={decreaseQuantity}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-lg w-8 text-center">
          {quantity}
        </span>
        <Button size="icon" variant="outline" onClick={increaseQuantity}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button size="lg" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};
