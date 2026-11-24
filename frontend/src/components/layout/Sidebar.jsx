
export const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    id: "categories",
    label: "Categories",
    icon: "categories",
  },
  {
    id: "books",
    label: "Books",
    icon: "books",
  },
  {
    id: "members",
    label: "Members",
    icon: "members",
  },
  {
    id: "loans",
    label: "Loans",
    icon: "loans",
  },
];

function NavigationIcon({ name }) {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    categories: (
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
    books: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 7h7M9 11h5" />
      </>
    ),
    members: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
        <path d="M17 4a4 4 0 0 1 0 8M22 21v-2a7 7 0 0 0-4-6.3" />
      </>
    ),
    loans: (
      <>
        <path d="M7 7h14l-4-4M21 7l-4 4" />
        <path d="M17 17H3l4 4M3 17l4-4" />
      </>
    ),
  };

  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <NavigationIcon name="books" />
        </div>

        <div className="brand-copy">
          <span className="brand-name">Library</span>
          <span className="brand-description">
            MANAGEMENT SYSTEM
          </span>
        </div>
      </div>

      <div className="sidebar-content">
        <span className="sidebar-label">NAVIGATION</span>

        <nav
          className="navigation"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              aria-current={
                activePage === item.id ? "page" : undefined
              }
              onClick={() => onNavigate(item.id)}
            >
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
