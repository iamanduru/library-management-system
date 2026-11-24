
import { useId, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import "../styles/books.css";

const emptyBook = {
  title: "",
  author: "",
  categoryId: "",
};

function BookForm({
  mode,
  values,
  categories,
  onChange,
  onSubmit,
  onCancel,
}) {
  const titleId = useId();
  const authorId = useId();
  const categoryId = useId();

  return (
    <section
      className="books-form-panel"
      aria-labelledby="book-form-heading"
    >
      <div className="books-form-heading">
        <div>
          <h2 id="book-form-heading">
            {mode === "edit" ? "Edit book" : "Add new book"}
          </h2>
          <p>
            {mode === "edit"
              ? "Update the selected book's details."
              : "Enter the details of a book in your collection."}
          </p>
        </div>

        <button
          type="button"
          className="books-close-button"
          onClick={onCancel}
          aria-label="Close book form"
        >
          ×
        </button>
      </div>

      <form className="books-form" onSubmit={onSubmit}>
        <div className="books-form-grid">
          <div className="books-field">
            <label htmlFor={titleId}>Book title</label>
            <input
              id={titleId}
              type="text"
              name="title"
              value={values.title}
              onChange={onChange}
              placeholder="Enter book title"
              required
              maxLength={200}
              autoFocus
            />
          </div>

          <div className="books-field">
            <label htmlFor={authorId}>Author</label>
            <input
              id={authorId}
              type="text"
              name="author"
              value={values.author}
              onChange={onChange}
              placeholder="Enter author's name"
              required
              maxLength={150}
            />
          </div>

          <div className="books-field">
            <label htmlFor={categoryId}>Category</label>
            <select
              id={categoryId}
              name="categoryId"
              value={values.categoryId}
              onChange={onChange}
              required
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="books-form-actions">
          <button
            type="button"
            className="books-secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="books-primary-button"
            disabled={categories.length === 0}
          >
            {mode === "edit"
              ? "Save changes"
              : "Save book"}
          </button>
        </div>
      </form>
    </section>
  );
}

function BookStatus({ borrowed }) {
  return (
    <span
      className={`books-status ${
        borrowed
          ? "books-status-borrowed"
          : "books-status-available"
      }`}
    >
      
      {borrowed ? "On loan" : "Available"}
    </span>
  );
}

export default function Books() {
  const {
    books,
    categories,
    loans,
    addBook,
    updateBook,
    deleteBook,
  } = useLibrary();

  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [editingIsbn, setEditingIsbn] = useState(null);
  const [formValues, setFormValues] = useState(emptyBook);
  const [deletingIsbn, setDeletingIsbn] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Look up categories without duplicating their data.
  const categoryNames = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ])
  );

  // A book is on loan if it has an active loan record.
  const borrowedBookIds = new Set(
    loans
      .filter((loan) => loan.returnDate === null)
      .map((loan) => loan.bookId)
  );

  // Search titles, authors, and category names.
  const query = search.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const category =
      categoryNames.get(book.categoryId) ?? "Uncategorized";

    return [
      book.title,
      book.author,
      category,
    ].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  function openCreateForm() {
    setFormMode("create");
    setEditingIsbn(null);
    setFormValues(emptyBook);
    setDeletingIsbn(null);
    setFeedback("");
  }

  function openEditForm(book) {
    setFormMode("edit");
    setEditingIsbn(book.isbn);
    setFormValues({
      title: book.title,
      author: book.author,
      categoryId: book.categoryId,
    });
    setDeletingIsbn(null);
    setFeedback("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingIsbn(null);
    setFormValues(emptyBook);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const bookData = {
      title: formValues.title.trim(),
      author: formValues.author.trim(),
      categoryId: formValues.categoryId,
    };

    // Basic form completeness checks.
    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.categoryId
    ) {
      return;
    }

    if (formMode === "edit") {
      updateBook(editingIsbn, bookData);
      setFeedback("Book updated successfully.");
    } else {
      addBook(bookData);
      setFeedback("Book added successfully.");
    }

    closeForm();
  }

  function handleDelete(book) {
    deleteBook(book.isbn);
    setDeletingIsbn(null);
    setFeedback(`${book.title} was removed.`);

    if (editingIsbn === book.isbn) {
      closeForm();
    }
  }

  return (
    <div className="books-page page-enter">
      <header className="books-header">
        <div>
          <h1>Books</h1>
          <p>
            Browse, organize, and manage books in your
            library collection.
          </p>
        </div>

        <button
          type="button"
          className="books-primary-button"
          onClick={openCreateForm}
        >
          <span aria-hidden="true">+</span>
          Add book
        </button>
      </header>

      {feedback && (
        <p className="books-feedback" role="status">
          {feedback}
        </p>
      )}

      {formMode && (
        <BookForm
          mode={formMode}
          values={formValues}
          categories={categories}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      <section
        className="books-table-panel"
        aria-label="Book records"
      >
        <div className="books-toolbar">
          <div className="books-search">
            <label
              htmlFor="book-search"
              className="books-sr-only"
            >
              Search books
            </label>

            <span aria-hidden="true">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 5 5" />
              </svg>
            </span>

            <input
              id="book-search"
              type="search"
              placeholder="Search books..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <span className="books-count">
            {filteredBooks.length}
            {filteredBooks.length === 1
              ? " book"
              : " books"}
          </span>
        </div>

        <div className="books-table-scroll">
          <table className="books-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="books-empty"
                  >
                    {search
                      ? "No books match your search."
                      : "No books yet. Add your first book."}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.isbn}>
                    <td className="books-title-cell">
                      {book.title}
                    </td>

                    <td>{book.author}</td>

                    <td>
                      {categoryNames.get(book.categoryId) ??
                        "Uncategorized"}
                    </td>

                    <td>
                      <BookStatus
                        borrowed={borrowedBookIds.has(
                          book.isbn
                        )}
                      />
                    </td>

                    <td>
                      <div className="books-row-actions">
                        <button
                          type="button"
                          className="books-text-button"
                          onClick={() =>
                            openEditForm(book)
                          }
                          aria-label={`Edit ${book.title}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="books-text-button books-danger"
                          onClick={() => {
                            setDeletingIsbn(book.isbn);
                            setFeedback("");
                          }}
                          aria-label={`Delete ${book.title}`}
                        >
                          Delete
                        </button>
                      </div>

                      {deletingIsbn === book.isbn && (
                        <div
                          className="books-confirm"
                          role="group"
                          aria-label={`Confirm deletion of ${book.title}`}
                        >
                          <span>Remove this book?</span>

                          <button
                            type="button"
                            onClick={() =>
                              setDeletingIsbn(null)
                            }
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="books-danger"
                            onClick={() =>
                              handleDelete(book)
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
