import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import "@testing-library/jest-dom";

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    // Check for class name presence if possible, or just execution without error
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-destructive");
  });
});
