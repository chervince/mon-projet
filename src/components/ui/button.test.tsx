import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("should render button text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-indigo-600");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-100");
  });
});
describe("Button variants", () => {
  it("should render primary variant", () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-indigo-600");
  });

  it("should render secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100");
  });

  it("should render outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-gray-300");
    expect(button).toHaveClass("bg-white");
  });
});

describe("Button sizes", () => {
  it("should render small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("should render medium size", () => {
    render(<Button size="md">Medium Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "text-base");
  });

  it("should render large size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });
});

describe("Button states", () => {
  it("should be disabled when loading", () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });

  it("should show loading spinner when loading", () => {
    render(<Button loading>Loading Button</Button>);
    const spinner = document.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});

describe("Button with icons", () => {
  it("should render with start icon", () => {
    const icon = <svg data-testid="start-icon" />;
    render(<Button startIcon={icon}>Button with Icon</Button>);
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  it("should render with end icon", () => {
    const icon = <svg data-testid="end-icon" />;
    render(<Button endIcon={icon}>Button with Icon</Button>);
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });
});
