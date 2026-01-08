"use client";

import { Button } from "@/components/ui/Button";
import { seedDatabase } from "@/lib/seed";
import toast from "react-hot-toast";

export const SeedButton = () => {
  const handleSeed = async () => {
    try {
      await seedDatabase();
      toast.success("Database seeded!");
    } catch {
      toast.error("Error seeding DB");
    }
  };
  return (
    <Button variant="secondary" onClick={handleSeed}>
      Seed Database (Dev Only)
    </Button>
  );
};
