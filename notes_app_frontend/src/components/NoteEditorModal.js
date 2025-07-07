import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function NoteEditorModal({ visible, note, categories, onSave, onClose }) {
  /**
   * Modal dialog for note editing and creation.
   * Fills form if note is provided, otherwise blank for new note.
   */
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setCategory(note?.category || "");
  }, [note, visible]);

  if (!visible) return null;
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__container">
        <h2>{note ? "Edit Note" : "Create Note"}</h2>
        <form
          className="modal__form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...note, title, content, category });
          }}
        >
          <label>
            Title
            <input
              className="modal__input"
              tabIndex={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              maxLength={100}
            />
          </label>
          <label>
            Category
            <select
              className="modal__input"
              tabIndex={2}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Content
            <textarea
              className="modal__input"
              tabIndex={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={1500}
            />
          </label>
          <div className="modal__actions">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteEditorModal;
