const STORAGE_KEY = "notemaster-notes_v1";

// PUBLIC_INTERFACE
export function getNotesForUser(username) {
  /**
   * Fetch all notes for the provided username.
   */
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return all[username] || [];
}

// PUBLIC_INTERFACE
export function saveNotesForUser(username, notes) {
  /**
   * Save notes array for specified user.
   */
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  all[username] = notes;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
