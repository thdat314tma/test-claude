export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  MAINTENANCE = 'MAINTENANCE',
  LOST = 'LOST'
}

export enum BorrowStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  category: string;
  status: BookStatus;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: Date;
  borrowedBooksCount: number;
  maxBorrowLimit: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowStatus;
}

export interface Statistics {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalUsers: number;
  activeBorrows: number;
  overdueBorrows: number;
}
