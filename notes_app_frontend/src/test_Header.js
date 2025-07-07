import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./components/Header";

describe("Header", () => {
  it("shows brand and logged-out subtitle if no user", () => {
    render(<Header user={null} onLogout={jest.fn()} />);
    expect(screen.getByText(/notemaster/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  it("greets user and shows logout", () => {
    render(<Header user={{ username: "Amy" }} onLogout={jest.fn()} />);
    expect(screen.getByText(/hi, amy/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
  it("calls onLogout when logout button clicked", () => {
    const onLogout = jest.fn();
    render(<Header user={{ username: "Amy" }} onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(onLogout).toHaveBeenCalled();
  });
});
