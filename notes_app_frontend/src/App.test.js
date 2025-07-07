import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock localStorage for isolation between test runs
function clearMockedStorage() {
  window.localStorage.clear();
}
beforeEach(clearMockedStorage);
afterEach(clearMockedStorage);

describe("Notes App - Integration", () => {
  test("Unauthenticated users see login prompt", () => {
    render(<App />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  test("Sign up, login, create/edit/delete a note, switch category, toggle theme", async () => {
    render(<App />);
    // Sign up new user
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "carol" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByText(/^sign up$/i));
    // Fill form
    await waitFor(() => {
      expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
      expect(screen.getByText(/your notes/i)).toBeInTheDocument();
    });

    // Add new category
    fireEvent.click(screen.getByTitle(/add category/i));
    window.prompt = jest.fn().mockReturnValue("Ideas");
    fireEvent.click(screen.getByTitle(/add category/i));
    expect(screen.getByText("Ideas")).toBeInTheDocument();

    // Create a new note
    fireEvent.click(screen.getByText(/\+ new note/i));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "First Note" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "Test Body" } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "Ideas" } });
    fireEvent.click(screen.getByText(/^save$/i));
    await waitFor(() =>
      expect(screen.getByText(/first note/i)).toBeInTheDocument()
    );

    // View the note and edit it
    fireEvent.click(screen.getByText(/first note/i));
    expect(screen.getByText(/test body/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/^edit$/i));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "First Note Edited" } });
    fireEvent.click(screen.getByText(/^save$/i));
    await waitFor(() =>
      expect(screen.getByText(/first note edited/i)).toBeInTheDocument()
    );

    // Delete note
    fireEvent.click(screen.getByText(/^delete$/i));
    fireEvent.click(screen.getByText(/^delete$/i)); // confirm
    await waitFor(() =>
      expect(screen.queryByText(/first note edited/i)).not.toBeInTheDocument()
    );

    // Theme toggle
    const themeButton = screen.getByRole("button", { name: /switch to dark/i });
    fireEvent.click(themeButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("Signup and login error states show correctly", async () => {
    render(<App />);
    // Try login (user not exist)
    fireEvent.click(screen.getByText(/^sign in$/i));
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bar" } });
    fireEvent.click(screen.getByText(/^sign in$/i));
    await waitFor(() =>
      expect(screen.getByText(/does not exist/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bar" } });
    fireEvent.click(screen.getByText(/^sign up$/i));
    await waitFor(() =>
      expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument()
    );

    // Try duplicate signup
    fireEvent.click(screen.getByText(/logout/i));
    await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bar" } });
    fireEvent.click(screen.getByText(/^sign up$/i));
    await waitFor(() => expect(screen.getByText(/already exists/i)).toBeInTheDocument());
  });

  test("Sidebar category selection filters notes", async () => {
    render(<App />);
    // Sign up and add two notes in different categories
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "bob" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByText(/^sign up$/i));

    // First note in Cat1
    fireEvent.click(screen.getByText(/\+ new note/i));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Note 1" } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "Body" } });
    fireEvent.click(screen.getByText(/^save$/i));
    // Second note in Cat2
    fireEvent.click(screen.getByText(/\+ new note/i));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Note 2" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "Body2" } });
    window.prompt = jest.fn().mockReturnValue("Cat2");
    fireEvent.click(screen.getByTitle(/add category/i));
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "Cat2" } });
    fireEvent.click(screen.getByText(/^save$/i));

    // Select category in sidebar
    fireEvent.click(screen.getByText("Cat2"));
    expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("All Notes"));
    expect(screen.getByText("Note 2")).toBeInTheDocument();
    expect(screen.getByText("Note 1")).toBeInTheDocument();
  });
});
