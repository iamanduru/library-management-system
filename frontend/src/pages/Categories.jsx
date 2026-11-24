
import { useId, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import "../styles/categories.css";

export default function Categories() {
  const inputId = useId();

  // Access shared sample data directly from Context
  const {
    categories,
    books,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useLibrary();

  // Page-specific UI state
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Filter categories by search term
  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  // Calculate book counts using shared data
  function getBookCount(categoryId) {
    return books.filter(
      (book) => book.categoryId === categoryId
    ).length;
  }

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setCategoryName("");
    setDeletingId(null);
    setFeedback("");
  }

  function openEditForm(category) {
    setFormMode("edit");
    setEditingId(category.id);
    setCategoryName(category.name);
    setDeletingId(null);
    setFeedback("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setCategoryName("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) return;

    if (formMode === "edit") {
      updateCategory(editingId, name);
      setFeedback("Category updated.");
    } else {
      addCategory(name);
      setFeedback("Category added.");
    }

    closeForm();
  }

  function handleDelete(category) {
    deleteCategory(category.id);
    setDeletingId(null);
    setFeedback(`${category.name} deleted.`);

    if (editingId === category.id) {
      closeForm();
    }
  }

  return (
    <div className="categories-page page-enter">
      <header className="categories-header">
        <div>
          <h1>Categories</h1>
          <p>
            Organize your collection into subject areas.
          </p>
        </div>

        <button
          type="button"
          className="categories-primary-button"
          onClick={openCreateForm}
        >
          <span aria-hidden="true">+</span>
          New category
        </button>
      </header>

      {feedback && (
        <p className="categories-feedback" role="status">
          {feedback}
        </p>
      )}

      {formMode && (
        <section
          className="categories-form-panel"
          aria-labelledby="category-form-title"
        >
          <div className="categories-form-heading">
            <div>
              <h2 id="category-form-title">
                {formMode === "edit"
                  ? "Edit category"
                  : "New category"}
              </h2>

              <p>
                {formMode === "edit"
                  ? "Update the category details."
                  : "Add a subject area to the collection."}
              </p>
            </div>

            <button
              type="button"
              className="categories-icon-button"
              onClick={closeForm}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="categories-form"
          >
            <div className="categories-field">
              <label htmlFor={inputId}>
                Category name
              </label>

              <input
                id={inputId}
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="e.g. Computer Science"
                required
                maxLength={100}
                autoFocus
              />
            </div>

            <div className="categories-form-actions">
              <button
                type="button"
                className="categories-secondary-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="categories-primary-button"
                disabled={!categoryName.trim()}
              >
                {formMode === "edit"
                  ? "Save changes"
                  : "Save category"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section
        className="categories-table-panel"
        aria-label="Category records"
      >
        <div className="categories-toolbar">
          <div className="categories-search">
            <label
              htmlFor="category-search"
              className="categories-sr-only"
            >
              Search categories
            </label>

            <span aria-hidden="true">⌕</span>

            <input
              id="category-search"
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <span className="categories-count">
            {filteredCategories.length}
            {filteredCategories.length === 1
              ? " category"
              : " categories"}
          </span>
        </div>

        <div className="categories-table-scroll">
          <table className="categories-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Books</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="categories-empty"
                  >
                    {search
                      ? "No categories match your search."
                      : "No categories yet. Add your first category."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="categories-name">
                      {category.name}
                    </td>

                    <td className="categories-book-count">
                      {getBookCount(category.id)}
                    </td>

                    <td>
                      <div className="categories-row-actions">
                        <button
                          type="button"
                          className="categories-text-button"
                          onClick={() =>
                            openEditForm(category)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="categories-text-button categories-danger"
                          onClick={() => {
                            setDeletingId(category.id);
                            setFeedback("");
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {deletingId === category.id && (
                        <div className="categories-confirm">
                          <span>
                            Delete this category?
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setDeletingId(null)
                            }
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="categories-danger"
                            onClick={() =>
                              handleDelete(category)
                            }
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
