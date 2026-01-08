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

export function formatDate(
  date: Date | { toDate: () => Date } | string | number | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!date) return "";

  let d: Date;

  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "object" && "toDate" in date) {
    // Handle Firebase Timestamp
    d = date.toDate();
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function truncate(str: string | undefined | null, length: number): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/^-+|-+$/g, "");
}

export function calculatePercentage(partialValue: number, totalValue: number): number {
  if (totalValue === 0) {
    return 0;
  }
  return (100 * partialValue) / totalValue;
}
