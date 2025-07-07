import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./components/Sidebar";

describe("Sidebar", () => {
  const cats = ["Cat1", "Fun"];
  it("renders with categories and highlights selection", () => {
    render(<Sidebar categories={cats} selectedCategory="Fun" onSelectCategory={jest.fn()} onAddCategory={jest.fn()} />);
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
    expect(screen.getByText("Cat1")).toBeInTheDocument();
    expect(screen.getByText("Fun")).toBeInTheDocument();
    expect(screen.getByText("Fun").parentElement).toHaveClass("selected");
    expect(screen.getByText(/all notes/i)).toBeInTheDocument();
  });

  it("calls select and add handlers", () => {
    const onSelect = jest.fn();
    const onAdd = jest.fn();
    render(<Sidebar categories={cats} selectedCategory={null} onSelectCategory={onSelect} onAddCategory={onAdd} />);
    fireEvent.click(screen.getByText("Cat1"));
    expect(onSelect).toHaveBeenCalledWith("Cat1");
    fireEvent.click(screen.getByText("All Notes"));
    expect(onSelect).toHaveBeenCalledWith(null);
    fireEvent.click(screen.getByTitle(/add category/i));
    expect(onAdd).toHaveBeenCalled();
  });
});
