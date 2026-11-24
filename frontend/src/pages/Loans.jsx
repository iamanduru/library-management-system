
import { useId, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import "../styles/loans.css";

// Format YYYY-MM-DD without timezone changes.
function formatDate(value) {
  if (!value) return "—";

  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

// Borrowing form
function BorrowForm({
  members,
  books,
  values,
  onChange,
  onSubmit,
  onCancel,
}) {
  const memberInputId = useId();
  const bookInputId = useId();

  return (
    <section
      className="loans-form-panel"
      aria-labelledby="borrow-form-heading"
    >
      <div className="loans-form-heading">
        <div>
          <h2 id="borrow-form-heading">
            Borrow a book
          </h2>

          <p>
            Select a registered member and a book
            from the collection.
          </p>
        </div>

        <button
          type="button"
          className="loans-close-button"
          onClick={onCancel}
          aria-label="Close borrowing form"
        >
          ×
        </button>
      </div>

      <form
        className="loans-form"
        onSubmit={onSubmit}
      >
        <div className="loans-form-grid">
          <div className="loans-field">
            <label htmlFor={memberInputId}>
              Library member
            </label>

            <select
              id={memberInputId}
              name="memberId"
              value={values.memberId}
              onChange={onChange}
              required
              autoFocus
            >
              <option value="">
                Select a member
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.fullName} —{" "}
                  {member.role === "STAFF"
                    ? "Staff"
                    : "Student"}
                </option>
              ))}
            </select>
          </div>

          <div className="loans-field">
            <label htmlFor={bookInputId}>
              Book
            </label>

            <select
              id={bookInputId}
              name="bookId"
              value={values.bookId}
              onChange={onChange}
              required
            >
              <option value="">
                Select a book
              </option>

              {books.map((book) => (
                <option
                  key={book.isbn}
                  value={book.isbn}
                >
                  {book.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="loans-form-note">
          Borrowing and due dates are generated
          automatically for this demonstration.
        </p>

        <div className="loans-form-actions">
          <button
            type="button"
            className="loans-secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="loans-primary-button"
            disabled={
              !values.memberId ||
              !values.bookId
            }
          >
            Confirm borrowing
          </button>
        </div>
      </form>
    </section>
  );
}

// Visual status indicator
function LoanStatus({ returned }) {
  return (
    <span
      className={`loans-status ${
        returned
          ? "loans-status-returned"
          : "loans-status-active"
      }`}
    >
      

      {returned ? "Returned" : "On loan"}
    </span>
  );
}

// Loans management page
export default function Loans() {
  const {
    loans,
    books,
    members,
    addLoan,
    returnLoan,
  } = useLibrary();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    memberId: "",
    bookId: "",
  });
  const [feedback, setFeedback] = useState("");

  // Create lookup maps for displaying record names.
  const bookNames = new Map(
    books.map((book) => [
      book.isbn,
      book.title,
    ])
  );

  const memberNames = new Map(
    members.map((member) => [
      member.id,
      member.fullName,
    ])
  );

  // Display newest borrowing records first.
  const sortedLoans = [...loans].sort((a, b) =>
    b.borrowDate.localeCompare(a.borrowDate)
  );

  // Search by book, member or loan status.
  const query = search.trim().toLowerCase();

  const filteredLoans = sortedLoans.filter((loan) => {
    const bookName =
      bookNames.get(loan.bookId) ?? "Unknown book";

    const memberName =
      memberNames.get(loan.memberId) ?? "Unknown member";

    const status =
      loan.returnDate === null
        ? "On loan"
        : "Returned";

    return [
      bookName,
      memberName,
      status,
    ].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  function openBorrowForm() {
    setFormValues({
      memberId: "",
      bookId: "",
    });

    setFeedback("");
    setFormOpen(true);
  }

  function closeBorrowForm() {
    setFormOpen(false);

    setFormValues({
      memberId: "",
      bookId: "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleBorrow(event) {
    event.preventDefault();

    if (
      !formValues.memberId ||
      !formValues.bookId
    ) {
      return;
    }

    addLoan({
      memberId: formValues.memberId,
      bookId: formValues.bookId,
    });

    closeBorrowForm();

    setFeedback(
      "Borrowing recorded successfully."
    );
  }

  function handleReturn(loan) {
    returnLoan(loan.id);

    setFeedback(
      "Book marked as returned."
    );
  }

  return (
    <div className="loans-page page-enter">
      <header className="loans-header">
        <div>
          <h1>Loans</h1>

          <p>
            Manage borrowing activity and
            book returns.
          </p>
        </div>

        <button
          type="button"
          className="loans-primary-button"
          onClick={openBorrowForm}
          disabled={
            members.length === 0 ||
            books.length === 0
          }
        >
          <span aria-hidden="true">+</span>
          Borrow book
        </button>
      </header>

      {feedback && (
        <p
          className="loans-feedback"
          role="status"
        >
          {feedback}
        </p>
      )}

      {formOpen && (
        <BorrowForm
          members={members}
          books={books}
          values={formValues}
          onChange={handleChange}
          onSubmit={handleBorrow}
          onCancel={closeBorrowForm}
        />
      )}

      <section
        className="loans-table-panel"
        aria-label="Loan records"
      >
        <div className="loans-toolbar">
          <div className="loans-search">
            <label
              htmlFor="loan-search"
              className="loans-sr-only"
            >
              Search loans
            </label>

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />
              <path d="m16 16 5 5" />
            </svg>

            <input
              id="loan-search"
              type="search"
              placeholder="Search loans..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <span className="loans-count">
            {filteredLoans.length}
            {filteredLoans.length === 1
              ? " loan"
              : " loans"}
          </span>
        </div>

        <div className="loans-table-scroll">
          <table className="loans-table">
            <thead>
              <tr>
                <th scope="col">
                  Book
                </th>

                <th scope="col">
                  Member
                </th>

                <th scope="col">
                  Borrowed
                </th>

                <th scope="col">
                  Due date
                </th>

                <th scope="col">
                  Return date
                </th>

                <th scope="col">
                  Status
                </th>

                <th scope="col">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="loans-empty"
                  >
                    {search
                      ? "No loans match your search."
                      : "No loans recorded yet."}
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const returned =
                    loan.returnDate !== null;

                  const bookName =
                    bookNames.get(loan.bookId) ??
                    "Unknown book";

                  return (
                    <tr key={loan.id}>
                      <td className="loans-book-cell">
                        {bookName}
                      </td>

                      <td>
                        {memberNames.get(
                          loan.memberId
                        ) ?? "Unknown member"}
                      </td>

                      <td>
                        {formatDate(
                          loan.borrowDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          loan.dueDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          loan.returnDate
                        )}
                      </td>

                      <td>
                        <LoanStatus
                          returned={returned}
                        />
                      </td>

                      <td>
                        {returned ? (
                          <span className="loans-completed">
                            Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="loans-return-button"
                            onClick={() =>
                              handleReturn(loan)
                            }
                            aria-label={`Mark ${bookName} as returned`}
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
