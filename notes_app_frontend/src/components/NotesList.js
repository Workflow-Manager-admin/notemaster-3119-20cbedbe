import React from "react";

// PUBLIC_INTERFACE
function NotesList({ notes, selectedNoteId, onSelectNote, onCreateNote }) {
  /** Displays the list of notes and allows selection. */
  return (
    <div className="notes-list__wrapper">
      <div className="notes-list__header">
        <h3>Your Notes</h3>
        <button className="btn btn-accent" onClick={onCreateNote}>
          + New Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="notes-list__empty">No notes yet.</div>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li
              key={note.id}
              className={
                "notes-list__item" +
                (note.id === selectedNoteId ? " selected" : "")
              }
              onClick={() => onSelectNote(note.id)}
            >
              <div className="notes-list__title">{note.title || "Untitled"}</div>
              <div className="notes-list__snippet">
                {note.content?.slice(0, 60) + (note.content?.length > 60 ? "..." : "")}
              </div>
              <div className="notes-list__meta">
                {note.category && (
                  <span className="notes-list__category">{note.category}</span>
                )}
                <span className="notes-list__date">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesList;
