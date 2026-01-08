"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/db/products";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BuyNowButtonProps {
  product: Product;
}

export const BuyNowButton = ({ product }: BuyNowButtonProps) => {
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login to purchase");
      router.push("/login");
      return;
    }

    await addToCart(product);
    router.push("/checkout");
  };

  return (
    <Button variant="secondary" size="lg" onClick={handleBuyNow} disabled={quantity > 0}>
      Buy Now
    </Button>
  );
};
