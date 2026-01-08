"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/Slider";
import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 14000]); // Default range
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleApply = useCallback(
    (value: number[]) => {
      setPriceRange(value);
      setLoading(true);

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer for debounced update
      const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", value[0].toString());
        params.set("maxPrice", value[1].toString());
        params.set("page", "1"); // Reset to page 1 on filter change
        router.push(`/products?${params.toString()}`);

        // Small delay to show loader before navigation completes
        setTimeout(() => setLoading(false), 300);
      }, 500); // 500ms debounce

      setDebounceTimer(timer);
    },
    [searchParams, router, debounceTimer]
  );

  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      setPriceRange([Number(minPrice), Number(maxPrice)]);
      setLoading(false); // Reset loading when URL params change
    } else {
      setPriceRange([0, 14000]);
      setLoading(false);
    }
  }, [searchParams]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Price Range</h3>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Filtering...</span>
          </div>
        )}
      </div>
      <div className="px-2">
        <Slider
          defaultValue={priceRange}
          max={20000}
          step={20}
          value={priceRange}
          onValueChange={handleApply}
          className="mb-4"
          disabled={loading}
        />
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
}
