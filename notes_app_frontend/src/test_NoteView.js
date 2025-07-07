import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteView from "./components/NoteView";

describe("NoteView", () => {
  it("renders empty state if no note", () => {
    render(<NoteView note={null} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/select a note/i)).toBeInTheDocument();
  });
  it("shows note fields and actions", () => {
    const note = { title: "My note", content: "hello", updatedAt: Date.now(), category: "Cat1" };
    render(<NoteView note={note} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/my note/i)).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.getByText(/cat1/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
  it("calls edit and delete actions", () => {
    const onEdit = jest.fn(), onDelete = jest.fn();
    const note = { title: "Note", content: "Body", updatedAt: Date.now(), category: "A" };
    render(<NoteView note={note} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });
});
