"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getRedirectResult,
} from "firebase/auth";
import {
  auth,
  createOrUpdateUserDocument,
  loginWithGoogle,
} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirectLoading, setIsRedirectLoading] = useState(true);
  const router = useRouter();

  // Centralized handler for successful login
  const handleAuthSuccess = async (authUser: User) => {
    try {
      await createOrUpdateUserDocument(authUser);
      toast.success("Signed in with Google!");
      router.push("/");
    } catch (error) {
      console.error("Error creating user doc:", error);
      toast.error("Error setting up user profile");
    }
  };

  // Handle Redirect Result (Mobile Flow)
  useEffect(() => {
    let mounted = true;

    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log("Redirect login result:", result);
        if (result?.user && mounted) {
          await handleAuthSuccess(result.user);
        }
      } catch (error) {
        console.error("Redirect login error:", error);
        if (mounted) toast.error("Google authentication failed.");
      } finally {
        if (mounted) setIsRedirectLoading(false);
      }
    };

    checkRedirect();

    return () => {
      mounted = false;
    };
  }, [router]); // Router dependency for linter, though practically stable

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("User state changed:", authUser);
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const user = await loginWithGoogle();

      // If user is returned, it means Popup flow succeeded immediately
      if (user) {
        await handleAuthSuccess(user);
      }
      // If null is returned, it means Redirect flow started (page will reload)
      // We don't need to do anything here.
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      // Only show error toast if it's not a user cancellation (which is handled in auth.ts but safe to double check)
      if (error.message !== "Sign-in cancelled by user") {
        toast.error(error.message || "Error signing in with Google");
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Optional: Clear user state manually if needed, but onAuthStateChanged handles it
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  // Loading state for initial auth check OR redirect check
  // This prevents the UI from flashing "unauthenticated" state while we are actually just processing the redirect
  if (loading || isRedirectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
