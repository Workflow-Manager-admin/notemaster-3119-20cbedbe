import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotesList from "./components/NotesList";
import NoteView from "./components/NoteView";
import NoteEditorModal from "./components/NoteEditorModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import AuthModal from "./components/AuthModal";
import { getNotesForUser, saveNotesForUser } from "./utils/notesStorage";

// PUBLIC_INTERFACE
function AppShell() {
  /**
   * Top-level shell: manages notes, modal dialogs, and layout.
   * Handles: theme, authentication, loading/saving notes, modals.
   */
  const { user, signIn, signUp, logout } = useAuth();
  // Theme: allow toggling
  const [theme, setTheme] = useState("light");
  // Notes, categories, and UI state
  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Effect: Set theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: on login, load notes for the user.
  useEffect(() => {
    if (user) {
      const userNotes = getNotesForUser(user.username);
      setNotes(userNotes);
      setSelectedNoteId(userNotes[0]?.id || null);
    } else {
      setNotes([]);
      setSelectedNoteId(null);
    }
  }, [user]);

  // Persist notes on change
  useEffect(() => {
    if (user) {
      saveNotesForUser(user.username, notes);
    }
  }, [notes, user]);

  // Category set
  const categories = Array.from(
    new Set(notes.map((note) => note.category).filter(Boolean))
  ).sort();

  // CRUD Operations
  // PUBLIC_INTERFACE
  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteModal(true);
  };

  // PUBLIC_INTERFACE
  const handleEditNote = () => {
    const n = notes.find((n) => n.id === selectedNoteId);
    setEditingNote(n);
    setShowNoteModal(true);
  };

  // PUBLIC_INTERFACE
  const handleSaveNote = (note) => {
    setShowNoteModal(false);
    let newNotes;
    if (note.id) {
      newNotes = notes.map((n) =>
        n.id === note.id ? { ...note, updatedAt: Date.now() } : n
      );
    } else {
      const id = Date.now() + Math.random().toString(36).substring(2, 8);
      newNotes = [
        {
          ...note,
          id,
          updatedAt: Date.now(),
        },
        ...notes,
      ];
      setSelectedNoteId(id);
    }
    setNotes(newNotes);
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = () => {
    setShowDeleteModal(false);
    setNotes(notes.filter((n) => n.id !== selectedNoteId));
    setSelectedNoteId((prevId) => {
      const idx = notes.findIndex((n) => n.id === prevId);
      if (idx > 0) return notes[idx - 1]?.id || null;
      if (idx === 0) return notes[1]?.id || null;
      return null;
    });
  };

  // PUBLIC_INTERFACE
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    const filtered = notes.filter(
      (n) => !category || n.category === category
    );
    setSelectedNoteId(filtered[0]?.id || null);
  };

  // PUBLIC_INTERFACE
  const handleSelectNote = (noteId) => {
    setSelectedNoteId(noteId);
  };

  // PUBLIC_INTERFACE
  const handleAddCategory = () => {
    const newCat = window.prompt("Enter category name:");
    if (
      newCat &&
      !categories.includes(newCat.trim()) &&
      /^[\w\s-&]{1,20}$/.test(newCat.trim())
    ) {
      // Add a dummy note to appear under this category if it's not empty
      handleSaveNote({
        title: "",
        content: "",
        category: newCat.trim(),
      });
    }
  };

  // PUBLIC_INTERFACE
  const handleLoginLogout = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  // PUBLIC_INTERFACE
  const handleAuth = async (username, password, isSignup) => {
    if (isSignup) await signUp(username, password);
    else await signIn(username, password);
    setShowAuthModal(false);
  };

  // Filter notes by category
  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category === selectedCategory)
    : notes;

  // App structure
  return (
    <div className="notes-app">
      <Header user={user} onLogout={handleLoginLogout} />
      <main className="main-layout">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onAddCategory={handleAddCategory}
        />
        <section className="main-content">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {/* Auth modal */}
          {(!user || showAuthModal) && (
            <AuthModal
              visible={!user || showAuthModal}
              onAuth={handleAuth}
              onClose={() => setShowAuthModal(false)}
            />
          )}
          {/* Notes app UI if user is authenticated */}
          {user && (
            <div className="layout-panels">
              <div className="panel-left">
                <NotesList
                  notes={filteredNotes}
                  selectedNoteId={selectedNoteId}
                  onSelectNote={handleSelectNote}
                  onCreateNote={handleCreateNote}
                />
              </div>
              <div className="panel-right">
                <NoteView
                  note={notes.find((n) => n.id === selectedNoteId)}
                  onEdit={handleEditNote}
                  onDelete={() => setShowDeleteModal(true)}
                />
              </div>
            </div>
          )}
          {/* Modals */}
          <NoteEditorModal
            visible={showNoteModal}
            note={editingNote}
            categories={categories}
            onSave={handleSaveNote}
            onClose={() => setShowNoteModal(false)}
          />
          <DeleteConfirmModal
            visible={showDeleteModal}
            noteTitle={
              notes.find((n) => n.id === selectedNoteId)?.title || "Untitled"
            }
            onConfirm={handleDeleteNote}
            onCancel={() => setShowDeleteModal(false)}
          />
        </section>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Outer provider for authentication context. */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
