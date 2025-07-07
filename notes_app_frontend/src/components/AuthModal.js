import React, { useState } from "react";

// PUBLIC_INTERFACE
function AuthModal({ visible, onAuth, onClose }) {
  /**
   * Modal dialog for signing in or signing up.
   * Calls onAuth(username, password, isSignup).
   */
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError("Username and password required.");
      return;
    }
    setAuthError("");
    onAuth(username, password, isSignup).catch((err) =>
      setAuthError(err?.message || "Authentication failed")
    );
  };

  if (!visible) return null;
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__container">
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              className="modal__input"
              maxLength={32}
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              className="modal__input"
              type="password"
              value={password}
              maxLength={32}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {authError && <div className="auth__error">{authError}</div>}
          <div className="modal__actions">
            <button className="btn btn-primary" type="submit">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="auth__hint">
          {isSignup ? (
            <>
              Have an account?{" "}
              <button
                className="btn btn-link"
                onClick={() => setIsSignup(false)}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                className="btn btn-link"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
