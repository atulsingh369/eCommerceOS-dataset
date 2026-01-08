"use client";

import { useState } from "react";
import { addOrUpdateSubscriber } from "@/lib/firebase/subscribers";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value.trim();

    if (!email) return toast.error("Enter a valid email");

    try {
      setLoading(true);
      const result = await addOrUpdateSubscriber(email);

      if (result.status === "updated") {
        toast("You're already subscribed 😊");
      } else {
        toast.success("You're subscribed 🎉");
      }

      (e.target as HTMLFormElement).reset();
      setIsSubscribed(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto flex items-center justify-center px-4 py-5 md:py-16">
      <div className="bg-primary rounded-2xl p-8 md:p-16 text-center text-primary-foreground w-fit">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8 max-w-lg mx-auto text-primary-foreground/80">
          Get product updates, new feature releases, and UI enhancements as we
          continue improving this AI-powered commerce experience.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <Input
            id="email"
            placeholder="Enter your email"
            disabled={isSubscribed}
          />
          <Button
            variant="secondary"
            size="lg"
            type="submit"
            className="text-base"
            disabled={loading || isSubscribed}
          >
            {loading ? "Joining..." : "Join the List"}
          </Button>
        </form>
      </div>
    </section>
  );
}
