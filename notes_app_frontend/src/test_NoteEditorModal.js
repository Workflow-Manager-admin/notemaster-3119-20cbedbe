import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteEditorModal from "./components/NoteEditorModal";

describe("NoteEditorModal", () => {
  const categories = ["Tech", "Books"];

  it("does not render if not visible", () => {
    render(<NoteEditorModal visible={false} note={null} categories={[]} onSave={jest.fn()} onClose={jest.fn()} />);
    expect(screen.queryByText(/create note/i)).toBeNull();
  });

  it("renders for create mode", () => {
    render(<NoteEditorModal visible={true} note={null} categories={categories} onSave={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByText(/create note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toHaveValue("");
    // Category options
    expect(screen.getByText(/uncategorized/i)).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
  });

  it("renders for edit mode and fills fields", () => {
    render(
      <NoteEditorModal
        visible={true}
        note={{ title: "A", content: "B", category: "Tech" }}
        categories={categories}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue(/a/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/b/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
  });

  it("calls onSave with form values", () => {
    const onSave = jest.fn();
    render(<NoteEditorModal visible note={null} categories={categories} onSave={onSave} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Title test" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "Body" } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "Books" } });
    fireEvent.click(screen.getByText(/^save$/i));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: "Title test", content: "Body", category: "Books" }));
  });

  it("calls onClose on cancel or backdrop", () => {
    const onClose = jest.fn();
    render(<NoteEditorModal visible categories={categories} onSave={jest.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText(/^cancel$/i));
    expect(onClose).toHaveBeenCalled();
  });
});
