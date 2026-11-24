
import { useState } from "react";

import { LibraryProvider } from "./context/LibraryContext";
import AppLayout from "./components/layout/AppLayout";
import { navigation } from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Loans from "./pages/Loans";

import "./App.css";

// Application page registry
const pages = {
  dashboard: Dashboard,
  categories: Categories,
  books: Books,
  members: Members,
  loans: Loans,
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const currentPage =
    navigation.find((page) => page.id === activePage) ??
    navigation[0];

  const SelectedPage = pages[currentPage.id];

  return (
    <LibraryProvider>
      <AppLayout
        activePage={currentPage.id}
        onNavigate={setActivePage}
        pageTitle={currentPage.label}
      >
        <SelectedPage />
      </AppLayout>
    </LibraryProvider>
  );
}

export default App;
