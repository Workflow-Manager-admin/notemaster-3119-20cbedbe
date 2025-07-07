import React from "react";

// PUBLIC_INTERFACE
function DeleteConfirmModal({ visible, noteTitle, onConfirm, onCancel }) {
  /** Modal dialog for delete note confirmation. */
  if (!visible) return null;
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onCancel} />
      <div className="modal__container">
        <h2>Delete Note</h2>
        <p>
          Are you sure you want to delete <b>{noteTitle || "this note"}</b>?
        </p>
        <div className="modal__actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
