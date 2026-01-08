"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground max-w-md">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
