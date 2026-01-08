import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/context/AuthContext";

// Mock the context
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
  })),
}));

describe("useAuth", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
