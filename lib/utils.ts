import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const currency = "INR";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | undefined | null) {
  if (price === undefined || price === null || isNaN(price)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(0);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}
