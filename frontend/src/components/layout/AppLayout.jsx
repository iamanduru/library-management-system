
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  children,
  activePage,
  onNavigate,
  pageTitle,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="main-shell">
        <Header pageTitle={pageTitle} />

        <main
          className="main-content"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
