import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast-forward time
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe("updated");
  });

  it("should handle multiple rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // Multiple rapid changes
    rerender({ value: "first", delay: 500 });
    expect(result.current).toBe("initial");

    rerender({ value: "second", delay: 500 });
    expect(result.current).toBe("initial");

    rerender({ value: "final", delay: 500 });
    expect(result.current).toBe("initial");

    // Only the last value should be applied after delay
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("final");
  });

  it("should handle delay changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 1000 } }
    );

    rerender({ value: "updated", delay: 1000 });
    expect(result.current).toBe("initial");

    // Advance only 500ms - should not update yet
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // Advance another 500ms - should update now
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("should handle different data types", () => {
    const { result } = renderHook(() => useDebounce({ count: 5 }, 500));
    expect(result.current).toEqual({ count: 5 });
  });

  it("should handle zero delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 0 } }
    );

    rerender({ value: "updated", delay: 0 });

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });
});
