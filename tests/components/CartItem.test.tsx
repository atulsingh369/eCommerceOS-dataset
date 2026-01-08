import { render, screen, fireEvent } from "@testing-library/react";
import { CartItem } from "@/components/cart/CartItem";
import "@testing-library/jest-dom";

const mockItem = {
  id: "1",
  name: "Test Product",
  price: 100,
  quantity: 2,
  image: "/test.jpg",
  category: "test",
  description: "",
  reviews: 0,
  rating: 5,
  features: [],
  stock: 10,
};

describe("CartItem", () => {
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    mockUpdate.mockClear();
    mockRemove.mockClear();
  });

  it("renders item details correctly", () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockUpdate}
        onRemove={mockRemove}
      />
    );
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByTestId("item-quantity")).toHaveTextContent("2");
  });

  it("calls updateQuantity on plus/minus click", () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockUpdate}
        onRemove={mockRemove}
      />
    );

    fireEvent.click(screen.getByTestId("increase-quantity"));
    expect(mockUpdate).toHaveBeenCalledWith("1", 3);

    fireEvent.click(screen.getByTestId("decrease-quantity"));
    expect(mockUpdate).toHaveBeenCalledWith("1", 1);
  });

  it("calls onRemove when delete clicked", () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockUpdate}
        onRemove={mockRemove}
      />
    );
    fireEvent.click(screen.getByTestId("remove-item-button"));
    expect(mockRemove).toHaveBeenCalledWith("1");
  });
});
