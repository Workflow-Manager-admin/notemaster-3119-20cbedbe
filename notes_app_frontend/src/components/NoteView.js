import React from "react";

// PUBLIC_INTERFACE
function NoteView({ note, onEdit, onDelete }) {
  /** Displays the selected note with edit and delete options. */
  if (!note) return <div className="note-view__empty">Select a note to view.</div>;

  return (
    <div className="note-view">
      <div className="note-view__head">
        <h2>{note.title || "Untitled"}</h2>
        <span className="note-view__category">{note.category}</span>
      </div>
      <div className="note-view__body">{note.content}</div>
      <div className="note-view__meta">
        <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>
      </div>
      <div className="note-view__actions">
        <button className="btn btn-secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteView;
