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
import { loginWithEmailPassword, resetPassword } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { LoginSchema, ResetPasswordSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationResult = LoginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      await loginWithEmailPassword(email, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error) {
      // Error message is already user-friendly from getFriendlyErrorMessage
      toast.error((error as Error).message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

    e.preventDefault();
    const validationResult = ResetPasswordSchema.safeParse({ email: resetEmail });
    
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      // Error message is already user-friendly from getFriendlyErrorMessage
      toast.error((error as Error).message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {showForgotPassword ? "Reset Password" : "Login"}
          </CardTitle>
          <CardDescription>
            {showForgotPassword
              ? "Enter your email to receive a password reset link."
              : "Enter your email and password to access your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            // Forgot Password Form
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-sm font-medium leading-none"
                >
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="m@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  disabled={resetLoading}
                >
                  Cancel
                </Button>
                <Button className="w-full" disabled={resetLoading}>
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            // Login Form
            <>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="relative my-6">
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
            </>
          )}
        </CardContent>
        {!showForgotPassword && (
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
