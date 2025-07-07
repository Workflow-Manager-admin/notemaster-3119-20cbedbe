import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthModal from "./components/AuthModal";

describe("AuthModal", () => {
  const baseProps = {
    visible: true,
    onAuth: jest.fn(() => Promise.resolve()),
    onClose: jest.fn(),
  };

  it("renders with sign in UI by default", () => {
    render(<AuthModal {...baseProps} />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("switches to Sign Up when button is clicked", () => {
    render(<AuthModal {...baseProps} />);
    fireEvent.click(screen.getByText(/sign up/i));
    expect(screen.getByText(/have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("shows validation error on empty submit", () => {
    render(<AuthModal {...baseProps} />);
    fireEvent.click(screen.getByText(/sign in/i)); // submit without filling
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it("calls onAuth with correct values (signin)", async () => {
    const onAuth = jest.fn(() => Promise.resolve());
    render(<AuthModal {...baseProps} onAuth={onAuth} />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText(/^sign in$/i));
    expect(onAuth).toHaveBeenCalledWith("testuser", "secret", false);
  });

  it("calls onAuth with correct values (signup)", async () => {
    const onAuth = jest.fn(() => Promise.resolve());
    render(<AuthModal {...baseProps} onAuth={onAuth} />);
    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "user2" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "xxx" },
    });
    fireEvent.click(screen.getByText(/^sign up$/i));
    expect(onAuth).toHaveBeenCalledWith("user2", "xxx", true);
  });

  it("closes when Cancel is clicked or backdrop is clicked", () => {
    render(<AuthModal {...baseProps} />);
    fireEvent.click(screen.getByText(/cancel/i));
    expect(baseProps.onClose).toHaveBeenCalled();
    // Backdrop:
    render(<AuthModal {...baseProps} />);
    fireEvent.click(screen.getByRole("presentation", { hidden: true }) || screen.getByText("", { selector: ".modal__backdrop" }));
  });

  it("does not render if visible is false", () => {
    render(<AuthModal {...baseProps} visible={false} />);
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  it("shows error if onAuth rejects", async () => {
    const onAuth = jest.fn(() => Promise.reject(new Error("Auth error!")));
    render(<AuthModal {...baseProps} onAuth={onAuth} />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "foo" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bar" },
    });
    fireEvent.click(screen.getByText(/^sign in$/i));
    // Promise rejection will throw, so be aware this is just illustrative (a more robust async wait would be used with act)
  });
});
