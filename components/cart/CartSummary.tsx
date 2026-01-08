"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { formatPrice } from "@/lib/utils";
import { CartTotals } from "@/lib/types";

interface CartSummaryProps {
  totals: CartTotals;
  onClearCart: () => void;
  loading?: boolean;
}

export function CartSummary({
  totals,
  onClearCart,
  loading,
}: CartSummaryProps) {
  return (
    <div className="lg:w-96 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium" data-testid="summary-subtotal">
              {formatPrice(totals.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes (Est.)</span>
            <span className="font-medium">{formatPrice(totals.tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium">
                -{formatPrice(totals.discountAmount)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span data-testid="summary-total">{formatPrice(totals.total)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/checkout" className="w-full">
            <Button
              className="w-full"
              size="lg"
              disabled={loading}
              data-testid="checkout-button"
            >
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <div className="text-xs text-center text-muted-foreground">
            Secure Checkout powered by Razorpay
          </div>
        </CardFooter>
      </Card>

      <Button
        variant="ghost"
        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={onClearCart}
        disabled={loading}
        data-testid="clear-cart-button"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear Shopping Cart
      </Button>
    </div>
  );
}
