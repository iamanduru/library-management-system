
/**
 * Library Management System
 * Frontend sample data.
 *
 * No backend connection.
 */

export const initialCategories = [
  {
    id: "cat-001",
    name: "Computer Science",
  },
  {
    id: "cat-002",
    name: "Literature",
  },
  {
    id: "cat-003",
    name: "Business & Economics",
  },
  {
    id: "cat-004",
    name: "History",
  },
];

export const initialBooks = [
  {
    isbn: "book-001",
    title: "Introduction to Java Programming",
    author: "Kevin Otieno",
    categoryId: "cat-001",
  },
  {
    isbn: "book-002",
    title: "Database Management Systems",
    author: "Amina Wanjiru",
    categoryId: "cat-001",
  },
  {
    isbn: "book-003",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    categoryId: "cat-002",
  },
  {
    isbn: "book-004",
    title: "Clean Code",
    author: "Robert C. Martin",
    categoryId: "cat-001",
  },
  {
    isbn: "book-005",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    categoryId: "cat-003",
  },
  {
    isbn: "book-006",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    categoryId: "cat-004",
  },
  {
    isbn: "book-007",
    title: "The Lean Startup",
    author: "Eric Ries",
    categoryId: "cat-003",
  },
  {
    isbn: "book-008",
    title: "Software Engineering Fundamentals",
    author: "Brian Kiptoo",
    categoryId: "cat-001",
  },
];

export const initialMembers = [
  {
    id: "member-001",
    fullName: "Achieng Otieno",
    email: "achieng.otieno@example.com",
    role: "STUDENT",
  },
  {
    id: "member-002",
    fullName: "Brian Kiptoo",
    email: "brian.kiptoo@example.com",
    role: "STAFF",
  },
  {
    id: "member-003",
    fullName: "Wanjiku Mwangi",
    email: "wanjiku.mwangi@example.com",
    role: "STUDENT",
  },
  {
    id: "member-004",
    fullName: "Hassan Abdullahi",
    email: "hassan.abdullahi@example.com",
    role: "STAFF",
  },
  {
    id: "member-005",
    fullName: "Naliaka Wekesa",
    email: "naliaka.wekesa@example.com",
    role: "STUDENT",
  },
];

export const initialLoans = [
  {
    id: "loan-001",
    memberId: "member-001",
    bookId: "book-001",
    borrowDate: "2026-11-18",
    dueDate: "2026-12-02",
    returnDate: null,
  },
  {
    id: "loan-002",
    memberId: "member-002",
    bookId: "book-003",
    borrowDate: "2026-11-17",
    dueDate: "2026-12-01",
    returnDate: null,
  },
  {
    id: "loan-003",
    memberId: "member-003",
    bookId: "book-004",
    borrowDate: "2026-11-15",
    dueDate: "2026-11-29",
    returnDate: null,
  },
  {
    id: "loan-004",
    memberId: "member-004",
    bookId: "book-006",
    borrowDate: "2026-11-06",
    dueDate: "2026-11-20",
    returnDate: "2026-11-15",
  },
];
