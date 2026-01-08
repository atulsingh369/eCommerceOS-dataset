"use client";

import React, { useState } from "react";
import {
  signupWithEmailPassword,
  loginWithEmailPassword,
  logout,
} from "@/lib/firebase/auth";
import GoogleSignInButton from "./GoogleSignInButton";
import { useRouter } from "next/navigation";

/**
 * Example component demonstrating how to use the authentication functions
 * This shows both email/password and Google OAuth authentication
 */
export default function AuthExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError("Name is required for signup");
          setIsLoading(false);
          return;
        }
        const result = await signupWithEmailPassword(email, password, name);

        // Show appropriate message based on whether account was linked
        if (result.wasLinked) {
          setSuccessMessage(
            result.message || "Successfully linked your accounts!"
          );
        } else {
          setSuccessMessage(result.message || "Account created successfully!");
        }
        console.log("Signup successful!", result);
      } else {
        await loginWithEmailPassword(email, password);
        setSuccessMessage("Logged in successfully!");
        console.log("Login successful!");
      }

      // Redirect after successful auth
      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      // Error messages are already user-friendly from getFriendlyErrorMessage
      const errorMessage = (err as Error).message || "Authentication failed";
      console.error("Auth error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isSignup ? "Sign Up" : "Log In"}
      </h2>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignup && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required={isSignup}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <GoogleSignInButton />

      {/* Toggle between signup and login */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>

      {/* Logout button (for testing) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
