import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
const AuthContext = createContext(null);

/** In-memory demo "user system" storing user info in localStorage. */
const FAKE_USER_KEY = "notemaster-user";

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Manages current user session, mimicking backend authentication.
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(FAKE_USER_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // PUBLIC_INTERFACE
  const signIn = async (username, password) => {
    // Simulate backend verification; password check skipped for demo
    let record = window.localStorage.getItem(`user-${username}`);
    if (record) {
      setUser({ username });
      window.localStorage.setItem(FAKE_USER_KEY, JSON.stringify({ username }));
      return true;
    } else {
      throw new Error("User does not exist. Please sign up.");
    }
  };

  // PUBLIC_INTERFACE
  const signUp = async (username, password) => {
    if (window.localStorage.getItem(`user-${username}`)) {
      throw new Error("Username already exists.");
    }
    window.localStorage.setItem(`user-${username}`, password);
    setUser({ username });
    window.localStorage.setItem(FAKE_USER_KEY, JSON.stringify({ username }));
    return true;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(FAKE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** PUBLIC_INTERFACE: Hook for consuming auth context. */
export function useAuth() {
  return useContext(AuthContext);
}
