"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background pt-10 pb-6">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + Ownership */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link
            href="https://atulsingh369.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-2xl font-bold font-sans tracking-tighter group"
          >
            <motion.div
              initial={{
                filter:
                  "brightness(100%) drop-shadow(0 0 0px rgba(61,255,157,0))",
                scale: 1,
              }}
              animate={{
                filter: [
                  "brightness(100%) drop-shadow(0 0 0px rgba(61,255,157,0))",
                  "brightness(130%) drop-shadow(0 0 10px rgba(61,255,157,0.6))",
                  "brightness(100%) drop-shadow(0 0 0px rgba(61,255,157,0))",
                ],
                scale: [1, 1.035, 1], // Micro pulse
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 5,
                repeatType: "loop",
              }}
              className="flex items-center text-2xl font-bold font-sans tracking-tighter group"
            >
              <img
                src="/devstudios-logo.png"
                alt="DevStudios Logo"
                className="h-20 w-20 opacity-90 transition-all duration-300 group-hover:brightness-125 group-hover:drop-shadow-[0_0_6px_rgba(61,255,157,0.6)]"
              />
            </motion.div>
          </Link>
          <p className="text-xs text-muted-foreground text-center md:text-left max-w-[240px] leading-relaxed">
            CommerceOS is developed and owned by DevStudios. Usage,
            distribution, or reproduction requires written permission.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm text-muted-foreground flex-wrap justify-center md:justify-end">
          <Link href="/" className="hover:text-foreground transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-foreground transition">
            Products
          </Link>
          <Link href="/about" className="hover:text-foreground transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-xs text-center text-muted-foreground mt-6">
        © {new Date().getFullYear()} DevStudios — All Rights Reserved.
      </div>
    </footer>
  );
}
