"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({
  images,
  name,
}: ProductImageGalleryProps) {
  const uniqueImages = Array.from(new Set(images)); // Deduplicate
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation effect
  useEffect(() => {
    if (uniqueImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % uniqueImages.length);
    }, 6000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [uniqueImages.length, isPaused]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  return (
    <div
      className="space-y-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-square relative overflow-hidden rounded-lg bg-muted border">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            <Image
              src={uniqueImages[selectedIndex]}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 overflow-x-auto p-2 no-scrollbar snap-x">
        {uniqueImages.map((img, i) => (
          <button
            key={i}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 snap-start",
              selectedIndex === i
                ? "border-primary ring-2 ring-primary/20 scale-105 shadow-md"
                : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
            )}
            onClick={() => setSelectedIndex(i)}
          >
            <Image
              src={img}
              alt={`${name} view ${i + 1}`}
              fill
              className="object-cover"
            />

            {/* Active indicator overlay for accessibility/visual cue */}
            {selectedIndex === i && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-primary/10"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
