
import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  initialCategories,
  initialBooks,
  initialMembers,
  initialLoans,
} from "../data/mockLibrary";

const LibraryContext = createContext(null);

// Format dates using the user's local calendar date.
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(() => ({
    categories: [...initialCategories],
    books: [...initialBooks],
    members: [...initialMembers],
    loans: [...initialLoans],
  }));

  // =====================================
  // CATEGORY OPERATIONS
  // =====================================

  function addCategory(name) {
    const newCategory = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    setLibrary((previous) => ({
      ...previous,
      categories: [...previous.categories, newCategory],
    }));
  }

  function updateCategory(id, name) {
    setLibrary((previous) => ({
      ...previous,
      categories: previous.categories.map((category) =>
        category.id === id
          ? { ...category, name: name.trim() }
          : category
      ),
    }));
  }

  function deleteCategory(id) {
    setLibrary((previous) => ({
      ...previous,
      categories: previous.categories.filter(
        (category) => category.id !== id
      ),
    }));
  }

  // =====================================
  // BOOK OPERATIONS
  // =====================================

  function addBook(bookData) {
    const newBook = {
      isbn: crypto.randomUUID(),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      categoryId: bookData.categoryId,
    };

    setLibrary((previous) => ({
      ...previous,
      books: [...previous.books, newBook],
    }));
  }

  function updateBook(isbn, bookData) {
    setLibrary((previous) => ({
      ...previous,
      books: previous.books.map((book) =>
        book.isbn === isbn
          ? {
              ...book,
              title: bookData.title.trim(),
              author: bookData.author.trim(),
              categoryId: bookData.categoryId,
            }
          : book
      ),
    }));
  }

  function deleteBook(isbn) {
    setLibrary((previous) => ({
      ...previous,
      books: previous.books.filter(
        (book) => book.isbn !== isbn
      ),
    }));
  }

  // =====================================
  // MEMBER OPERATIONS
  // =====================================

  function addMember(memberData) {
    const newMember = {
      id: crypto.randomUUID(),
      fullName: memberData.fullName.trim(),
      email: memberData.email.trim(),
      role: memberData.role,
    };

    setLibrary((previous) => ({
      ...previous,
      members: [...previous.members, newMember],
    }));
  }

  function updateMember(id, memberData) {
    setLibrary((previous) => ({
      ...previous,
      members: previous.members.map((member) =>
        member.id === id
          ? {
              ...member,
              fullName: memberData.fullName.trim(),
              email: memberData.email.trim(),
              role: memberData.role,
            }
          : member
      ),
    }));
  }

  function deleteMember(id) {
    setLibrary((previous) => ({
      ...previous,
      members: previous.members.filter(
        (member) => member.id !== id
      ),
    }));
  }

  // =====================================
  // LOAN OPERATIONS
  // =====================================

  function addLoan({ memberId, bookId }) {
    const today = new Date();

    const dueDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 14
    );

    const newLoan = {
      id: crypto.randomUUID(),
      memberId,
      bookId,
      borrowDate: formatLocalDate(today),
      dueDate: formatLocalDate(dueDate),
      returnDate: null,
    };

    setLibrary((previous) => ({
      ...previous,
      loans: [...previous.loans, newLoan],
    }));
  }

  function returnLoan(loanId) {
    const today = formatLocalDate(new Date());

    setLibrary((previous) => ({
      ...previous,
      loans: previous.loans.map((loan) =>
        loan.id === loanId
          ? {
              ...loan,
              returnDate: loan.returnDate ?? today,
            }
          : loan
      ),
    }));
  }

  // =====================================
  // SHARED DATA AND ACTIONS
  // =====================================

  const value = {
    // Records
    categories: library.categories,
    books: library.books,
    members: library.members,
    loans: library.loans,

    // Categories
    addCategory,
    updateCategory,
    deleteCategory,

    // Books
    addBook,
    updateBook,
    deleteBook,

    // Members
    addMember,
    updateMember,
    deleteMember,

    // Loans
    addLoan,
    returnLoan,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error(
      "useLibrary must be used within LibraryProvider"
    );
  }

  return context;
}
