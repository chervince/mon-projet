import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  slugify,
  formatCurrency,
  calculatePercentage,
  isValidEmail,
} from "./utils";

describe("cn (classname utility)", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should merge conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatDate", () => {
  it("should format date correctly in French", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);
    expect(result).toContain("janvier");
    expect(result).toContain("2024");
  });

  it("should handle different dates", () => {
    const date = new Date("2024-12-25");
    const result = formatDate(date);
    expect(result).toContain("décembre");
  });
});

describe("slugify", () => {
  it("should convert string to slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("should handle accents", () => {
    expect(slugify("Café Français")).toBe("cafe-francais");
  });

  it("should handle special characters", () => {
    expect(slugify("Test@#$%^&*()")).toBe("test");
  });

  it("should handle multiple spaces and hyphens", () => {
    expect(slugify("  Hello   --  World  ")).toBe("hello-world");
  });

  it("should handle empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("formatCurrency", () => {
  it("should format XPF currency correctly", () => {
    expect(formatCurrency(1000)).toContain("000");
    expect(formatCurrency(1000)).toContain("FCFP");
  });

  it("should handle decimals", () => {
    expect(formatCurrency(1234.56)).toContain("235");
    expect(formatCurrency(1234.56)).toContain("FCFP");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toContain("0");
    expect(formatCurrency(0)).toContain("FCFP");
  });
});

describe("calculatePercentage", () => {
  it("should calculate percentage correctly", () => {
    expect(calculatePercentage(1000, 10)).toBe(100);
    expect(calculatePercentage(2000, 15)).toBe(300);
  });

  it("should round to nearest integer", () => {
    expect(calculatePercentage(1000, 10.5)).toBe(105);
    expect(calculatePercentage(1000, 10.4)).toBe(104);
  });

  it("should handle zero percentage", () => {
    expect(calculatePercentage(1000, 0)).toBe(0);
  });

  it("should handle 100% percentage", () => {
    expect(calculatePercentage(1000, 100)).toBe(1000);
  });
});

describe("isValidEmail", () => {
  it("should validate correct emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("test+tag@gmail.com")).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("test")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("test@example")).toBe(false);
    expect(isValidEmail("test example.com")).toBe(false);
  });
});
