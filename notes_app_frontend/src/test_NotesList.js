import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotesList from "./components/NotesList";

describe("NotesList", () => {
  const sampleNotes = [
    { id: "1", title: "n1", content: "abc", updatedAt: Date.now(), category: "A" },
    { id: "2", title: "n2", content: "xyzdef", updatedAt: Date.now(), category: "B" },
  ];

  it("shows empty state when no notes", () => {
    render(<NotesList notes={[]} selectedNoteId={null} onSelectNote={jest.fn()} onCreateNote={jest.fn()} />);
    expect(screen.getByText(/no notes/i)).toBeInTheDocument();
  });

  it("renders notes and highlights selected", () => {
    render(<NotesList notes={sampleNotes} selectedNoteId="2" onSelectNote={jest.fn()} onCreateNote={jest.fn()} />);
    expect(screen.getByText(/n1/i)).toBeInTheDocument();
    expect(screen.getByText(/n2/i)).toBeInTheDocument();
    expect(screen.getByText(/xyzdef/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[1]).toHaveClass("selected");
  });

  it("calls onCreateNote when new note button clicked", () => {
    const onCreateNote = jest.fn();
    render(<NotesList notes={[]} onSelectNote={jest.fn()} onCreateNote={onCreateNote} />);
    fireEvent.click(screen.getByText(/\+ new note/i));
    expect(onCreateNote).toHaveBeenCalled();
  });

  it("calls onSelectNote when item is clicked", () => {
    const onSelectNote = jest.fn();
    render(<NotesList notes={sampleNotes} onSelectNote={onSelectNote} onCreateNote={jest.fn()} />);
    fireEvent.click(screen.getByText(/n1/i));
    expect(onSelectNote).toHaveBeenCalledWith("1");
  });
});
