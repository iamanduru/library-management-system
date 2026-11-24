
export default function Header({ pageTitle }) {
  return (
    <header className="topbar">
      <nav
        className="topbar-location"
        aria-label="Breadcrumb"
      >
        <span>Library</span>

        <span
          className="breadcrumb-separator"
          aria-hidden="true"
        >
          /
        </span>

        <strong aria-current="page">
          {pageTitle}
        </strong>
      </nav>
    </header>
  );
}
