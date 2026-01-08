"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useState } from "react";
import { signupWithEmailPassword } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { RegisterSchema } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationResult = RegisterSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      // Our new function handles profile update, Firestore document creation, AND account linking
      const result = await signupWithEmailPassword(
        email,
        password,
        `${firstName} ${lastName}`
      );

      // Display appropriate message based on whether account was linked
      if (result.wasLinked) {
        toast.success(result.message || "Successfully linked your accounts!");
      } else {
        toast.success(result.message || "Account created successfully!");
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className="text-sm font-medium leading-none"
                >
                  First name
                </label>
                <Input
                  id="first-name"
                  name="firstName"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className="text-sm font-medium leading-none"
                >
                  Last name
                </label>
                <Input
                  id="last-name"
                  name="lastName"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none"
              >
                Password
              </label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleSignInButton />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
