"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmationModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Use portal if possible to ensure z-index correctness, but for simplicity in this env we might just render it.
  // Actually, creating a portal is safer for existing apps.
  // We'll wrap in portal if document is defined.

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-3">
                {variant === "danger" && (
                  <div className="bg-destructive/10 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 flex items-center justify-end gap-3 bg-card">
              <Button
                variant="outline" // Assuming outline variant exists
                onClick={onClose}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button
                // If variant is danger, we might need a destructive variant for Button if it exists,
                // or just style it. I'll stick to props I know likely exist or standard className
                variant={variant === "danger" ? "destructive" : "default"}
                onClick={onConfirm}
                disabled={loading}
                className={
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : ""
                }
              >
                {loading ? "Processing..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
