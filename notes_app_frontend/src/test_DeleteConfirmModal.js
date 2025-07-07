import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

describe("DeleteConfirmModal", () => {
  it("does not render when visible is false", () => {
    render(<DeleteConfirmModal visible={false} noteTitle="Test Note" onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.queryByText(/delete note/i)).toBeNull();
  });

  it("renders with default and custom note title", () => {
    render(<DeleteConfirmModal visible noteTitle="Test Note" onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText(/delete note/i)).toBeInTheDocument();
    expect(screen.getByText(/test note/i)).toBeInTheDocument();
    // Default fallback
    render(<DeleteConfirmModal visible noteTitle="" onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText(/this note/i)).toBeInTheDocument();
  });

  it("calls onConfirm and onCancel when buttons are clicked", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(<DeleteConfirmModal visible noteTitle="Title" onConfirm={onConfirm} onCancel={onCancel} />);
    fireEvent.click(screen.getByText(/^delete$/i));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(screen.getByText(/^cancel$/i));
    expect(onCancel).toHaveBeenCalled();
  });
});
