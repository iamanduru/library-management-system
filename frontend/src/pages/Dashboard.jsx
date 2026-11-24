
import { useLibrary } from "../context/LibraryContext";
import "../styles/dashboard.css";

// Format a local date for display.
function formatDate(value) {
  if (!value) return "—";

  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

// Compact dashboard statistic.
function Metric({ label, value }) {
  return (
    <div className="overview-metric">
      <span className="overview-metric-value">
        {value}
      </span>

      <span className="overview-metric-label">
        {label}
      </span>
    </div>
  );
}

// Recent borrowing activity.
function RecentLoans({ loans, books, members }) {
  const recentLoans = [...loans]
    .sort((a, b) =>
      b.borrowDate.localeCompare(a.borrowDate)
    )
    .slice(0, 6);

  const bookNames = new Map(
    books.map((book) => [book.isbn, book.title])
  );

  const memberNames = new Map(
    members.map((member) => [
      member.id,
      member.fullName,
    ])
  );

  return (
    <section
      className="overview-panel overview-activity"
      aria-labelledby="recent-loans-heading"
    >
      <div className="overview-panel-header">
        <div>
          <h2 id="recent-loans-heading">
            Recent loans
          </h2>
          <p>Latest borrowing activity in the library</p>
        </div>

        <span className="overview-record-count">
          {recentLoans.length} records
        </span>
      </div>

      <div className="overview-table-scroll">
        <table className="overview-table">
          <thead>
            <tr>
              <th scope="col">Book</th>
              <th scope="col">Member</th>
              <th scope="col">Borrowed</th>
              <th scope="col">Due</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentLoans.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="overview-empty"
                >
                  No loans recorded yet.
                </td>
              </tr>
            ) : (
              recentLoans.map((loan) => {
                const returned =
                  loan.returnDate !== null;

                return (
                  <tr key={loan.id}>
                    <td className="overview-book-name">
                      {bookNames.get(loan.bookId) ??
                        "Unknown book"}
                    </td>

                    <td>
                      {memberNames.get(loan.memberId) ??
                        "Unknown member"}
                    </td>

                    <td>
                      {formatDate(loan.borrowDate)}
                    </td>

                    <td>
                      {formatDate(loan.dueDate)}
                    </td>

                    <td>
                      <span
                        className={`overview-status ${
                          returned
                            ? "overview-status-returned"
                            : "overview-status-active"
                        }`}
                      >
                        <span
                          className=""
                          aria-hidden="true"
                        />
                        {returned ? "Returned" : "On loan"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Active loans ordered by due date.
function ScheduledReturns({ loans, books }) {
  const activeLoans = loans
    .filter((loan) => loan.returnDate === null)
    .sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    )
    .slice(0, 4);

  const bookNames = new Map(
    books.map((book) => [book.isbn, book.title])
  );

  return (
    <aside
      className="overview-panel overview-returns"
      aria-labelledby="scheduled-returns-heading"
    >
      <div className="overview-panel-header">
        <div>
          <h2 id="scheduled-returns-heading">
            Scheduled returns
          </h2>
          <p>Books currently on loan</p>
        </div>
      </div>

      <div className="overview-return-list">
        {activeLoans.length === 0 ? (
          <p className="overview-empty">
            No books are currently on loan.
          </p>
        ) : (
          activeLoans.map((loan) => {
            const [year, month, day] =
              loan.dueDate.split("-").map(Number);

            const monthLabel =
              new Intl.DateTimeFormat("en-GB", {
                month: "short",
              }).format(new Date(year, month - 1, day));

            return (
              <div
                className="overview-return-item"
                key={loan.id}
              >
                <div className="overview-return-date">
                  <span className="overview-return-day">
                    {String(day).padStart(2, "0")}
                  </span>

                  <span className="overview-return-month">
                    {monthLabel}
                  </span>
                </div>

                <div className="overview-return-info">
                  <strong>
                    {bookNames.get(loan.bookId) ??
                      "Unknown book"}
                  </strong>

                  <span>
                    Due {formatDate(loan.dueDate)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

// Main Dashboard page.
export default function Dashboard() {
  const {
    books,
    categories,
    members,
    loans,
  } = useLibrary();

  const booksOut = loans.filter(
    (loan) => loan.returnDate === null
  ).length;

  const metrics = [
    {
      label: "Total books",
      value: books.length,
    },
    {
      label: "Members",
      value: members.length,
    },
    {
      label: "Categories",
      value: categories.length,
    },
    {
      label: "Books on loan",
      value: booksOut,
    },
  ];

  return (
    <div className="overview-page page-enter">
      <header className="overview-heading">
        <div>
          <h1>Overview</h1>
          <p>
            Your library collection and lending activity,
            all in one place.
          </p>
        </div>
      </header>

      <section
        className="overview-metrics"
        aria-label="Library statistics"
      >
        {metrics.map((metric) => (
          <Metric
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <div className="overview-content">
        <RecentLoans
          loans={loans}
          books={books}
          members={members}
        />

        <ScheduledReturns
          loans={loans}
          books={books}
        />
      </div>
    </div>
  );
}
