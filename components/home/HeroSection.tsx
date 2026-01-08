"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative px-4 py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="container mx-auto flex flex-col items-center text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-2" variant="secondary">
            AI-Powered Demo Store - Fully Customizable
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Build Your Next-Gen AI Commerce Store
        </motion.h1>

        <motion.p
          className="max-w-[700px] text-muted-foreground md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Super-fast, scalable storefronts powered by Next.js, Firebase & AI
          automation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/products">
            <Button size="full" className="px-8 transition-all hover:scale-105">
              Launch Demo
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="full"
              className="px-8 transition-all hover:scale-105 hover:bg-background"
            >
              View Features
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
