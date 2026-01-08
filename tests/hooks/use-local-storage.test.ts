import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("should return initial value", () => {
        const { result } = renderHook(() => useLocalStorage("key", "initial"));
        expect(result.current[0]).toBe("initial");
    });

    it("should update and persist value", () => {
        const { result } = renderHook(() => useLocalStorage("key", "initial"));

        act(() => {
            result.current[1]("new value");
        });

        expect(result.current[0]).toBe("new value");
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify("new value"));
    });
});
