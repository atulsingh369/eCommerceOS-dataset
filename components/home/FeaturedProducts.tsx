"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/db/products";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Product Display Showcase
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            A clean, high-conversion product grid built with Firestore data and
            real-time filtering.
          </p>
        </div>

        <Link
          href="/products"
          className="text-primary hover:underline flex items-center gap-1 self-end sm:self-auto text-sm font-medium"
        >
          View All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <Card className="overflow-hidden group h-full flex flex-col relative">
              <Link
                href={`/products/${product.id}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {product.name}</span>
              </Link>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 shadow-sm z-20">
                    New
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 pt-4 flex-1">
                <h3 className="font-semibold text-lg leading-tight group-hover:underline line-clamp-1 transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {product.category}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <span className="font-bold text-lg">
                  {formatPrice(product.price)}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="transition-transform active:scale-95 z-20"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        {products.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">
            No featured products found.
          </p>
        )}
      </motion.div>
    </section>
  );
}
