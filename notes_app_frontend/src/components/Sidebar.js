import React from "react";

// PUBLIC_INTERFACE
function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}) {
  /** Sidebar navigation for note categories/tags. */
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <h3>Categories</h3>
        <button
          className="btn btn-small btn-secondary sidebar__add"
          onClick={onAddCategory}
          title="Add Category"
        >
          +
        </button>
      </div>
      <ul className="sidebar__list">
        <li
          className={!selectedCategory ? "selected" : ""}
          onClick={() => onSelectCategory(null)}
        >
          All Notes
        </li>
        {categories.map((cat) => (
          <li
            key={cat}
            className={cat === selectedCategory ? "selected" : ""}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
