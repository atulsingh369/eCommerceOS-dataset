"use client";

import { seedDatabase } from "@/lib/seed";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import toast from "react-hot-toast";

export function SeedButton() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedDatabase();
      toast.success("Database seeded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Seeding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      type="button"
      className="text-base"
      onClick={handleSeed}
      disabled={loading}
    >
      {loading ? "Seeding..." : "Seed Database"}
    </Button>
  );
}