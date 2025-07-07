import React from "react";

// PUBLIC_INTERFACE
function Header({ user, onLogout }) {
  /** Header navigation bar for logo, navigation, and user actions. */
  return (
    <header className="header">
      <div className="header__brand">Notemaster</div>
      <nav className="header__nav">
        {user ? (
          <>
            <span className="header__user">Hi, {user.username}</span>
            <button className="btn btn-accent" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="header__subtitle">
            Sign in to access your notes securely.
          </span>
        )}
      </nav>
    </header>
  );
}

export default Header;
