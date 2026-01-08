"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Category, subscribeToCategories } from "@/lib/db/products";
import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((categories) => {
      setCategories(categories);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <Link
            href={`/products?category=${category.slug}`}
            key={category.id}
            className="group block"
          >
            <Card className="overflow-hidden h-full border-none shadow-md transition-shadow hover:shadow-xl">
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                    <p className="opacity-90 max-w-sm mx-auto">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
