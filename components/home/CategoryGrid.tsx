"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/db/products";
import { motion } from "framer-motion";

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
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          Beautiful, image-driven category browsing designed for clarity and
          conversions.
        </p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg block h-full"
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                    <h3 className="text-2xl font-bold mb-2 transform transition-transform group-hover:scale-110 duration-300">
                      {category.name}
                    </h3>
                    <span className="hidden group-hover:inline-block px-4 py-2 border border-white rounded-full text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
