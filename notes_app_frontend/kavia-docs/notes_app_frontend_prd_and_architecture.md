# Notes App Frontend: PRD and Architecture Documentation

## Product Requirements Document (PRD)

### Overview
The Notes App enables users to create, edit, categorize, and manage personal notes via an intuitive and responsive web interface. Core features include user authentication, note CRUD operations, category/tag organization, and a clean, modern UI/UX supporting both light and dark themes.

### Features

**Authentication**
- Signup and login using a modal dialog.
- In-memory demo authentication, storing session in localStorage.

**Note Management**
- Create, edit, delete notes (with modal dialogs).
- View and select notes from a categorized list.
- Edit note title, content, and assign categories/tags.

**Categories**
- Notes can be grouped under categories.
- Ability to add new categories/tags via the sidebar UI.

**User Experience**
- Responsive design for desktop and mobile.
- Theme toggle (light/dark mode) included.
- Friendly error states, confirmation dialogs, and instant feedback.

**Persistence**
- Notes and user session are persisted locally on the browser via localStorage.

---

## UI/UX Structure

### Layout

- **Header** — Contains branding and authentication actions (login/logout, user greeting).
- **Sidebar** — Displays note categories/tags; allows category selection and creation.
- **Main Content** — Split into:
    - **Notes List** — Shows all notes in the active category.
    - **Note View** — Displays the selected note with edit and delete actions.
- **Modals** — Used for note editing, creation, deletion, and authentication.

### Visual Design

- Modern, clean, and minimal interface.
- Theming via CSS variables supporting KAVIA brand colors.
- Key colors:  
  - Primary: `#1976d2`  
  - Secondary: `#424242`  
  - Accent: `#ff9800`
- Responsive breakpoints ensure usability on mobiles/tablets.

---

## Component Architecture

### Top-Level Structure

- `App.js`  
  - Wraps everything in `AuthProvider`.
  - Renders `Header`, `Sidebar`, `NotesList`, `NoteView`, and modal dialogs.
  - Manages all global state (authenticated user, notes, selection, theme, modals).

### Components
- `Header`  
  - Displays logo and user/account actions.
- `Sidebar`  
  - Lists categories/tags, allows selection and addition.
- `NotesList`  
  - Displays all notes for the current category; allows note selection or creation.
- `NoteView`  
  - Detailed note view with edit and delete buttons.
- `NoteEditorModal`  
  - Form modal for creating or editing notes.
- `DeleteConfirmModal`  
  - Modal for confirming note deletion.
- `AuthModal`  
  - Modal for login/signup.

### Context and Utilities

- `AuthContext`  
  - Provides authentication state and actions (sign-in, sign-up, sign-out).
  - Accessible app-wide via `useAuth`.

- `notesStorage.js`  
  - Handles saving/fetching notes per user to/from localStorage.

---

## State Management and Data Flow

### State

- Maintained using top-level React component state (`useState` hooks) in `App.js` for:
    - Authentication/user data
    - Notes list
    - Selected note ID and category
    - Modal dialog visibility and content
    - Theme selection

- Notes and users are persisted in localStorage through utility and context files.

### Data Flow

1. **Authentication**  
   - User logs in/signs up through `AuthModal`, updating the `AuthContext`.
   - Upon successful authentication, notes are loaded for the user via `notesStorage.js`.

2. **Notes Operations**  
   - Notes are created/edited/deleted through corresponding modals.
   - On submission, local state is updated and persisted immediately via `notesStorage.js`.

3. **UI Updates**  
   - Selection of notes/categories directly influences what is displayed in the main content.
   - State changes in the root update props to all child components, maintaining a unidirectional, predictable data flow.

4. **Theme Toggle**  
   - Controlled by state in `App.js`; sets a data attribute on the document root, toggling CSS themes.

---

## System Diagram

Below is a mermaid diagram describing the main component and data flow architecture:

```mermaid
graph TD
    A[App (with AuthProvider)] --> B(Header)
    A --> C(Sidebar)
    A --> D(NotesList)
    A --> E(NoteView)
    A --> F(NoteEditorModal)
    A --> G(DeleteConfirmModal)
    A --> H(AuthModal)
    A -- uses --> I[AuthContext]
    A -- calls --> J[notesStorage.js]
    I -- provides --> A
    D -- on note select --> E
    D -- on create --> F
    E -- on edit/delete --> F
    E -- on delete --> G
    H -- updates --> I
    F -- on save --> A
    G -- on confirm --> A
    subgraph LocalStorage
        J
    end
    A -- reads/writes --> J
```

---

## File References and Main Responsibilities

- `App.js` — Shell, state, layout, orchestration of all features.
- `src/components/` — Modular UI for core layout and dialogs.
- `context/AuthContext.js` — User session management.
- `utils/notesStorage.js` — Browser persistence for notes per user.
- `App.css` — Modern, responsive, brand-aligned styling; theme support.

---

## Development & Dependencies

- Tech stack: React (no extra bulky UI library), functional components, CSS Modules.
- Build: [`react-scripts`](https://www.npmjs.com/package/react-scripts), quick local development.
- LocalStorage is used for demo persistence, with username/password fields but no backend API.

---

## Summary

This Notes App frontend demonstrates a modern, component-driven React design, featuring local authentication, categorized note-taking, and a fully responsive, themeable UI—all with minimal dependencies and a focus on extensibility.

