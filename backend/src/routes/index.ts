import { Router } from 'express';
import { LibraryController } from '../controllers/LibraryController';

const router = Router();

// ============ BOOKS ROUTES ============
router.get('/books', LibraryController.getAllBooks);
router.get('/books/available', LibraryController.getAvailableBooks);
router.get('/books/search/title/:query', LibraryController.searchBooksByTitle);
router.get('/books/search/author/:query', LibraryController.searchBooksByAuthor);
router.get('/books/search/category/:query', LibraryController.searchBooksByCategory);
router.get('/books/:id', LibraryController.getBookById);
router.post('/books', LibraryController.addBook);
router.delete('/books/:id', LibraryController.deleteBook);

// ============ USERS ROUTES ============
router.get('/users', LibraryController.getAllUsers);
router.get('/users/:id', LibraryController.getUserById);
router.get('/users/:id/borrows', LibraryController.getUserBorrows);
router.get('/users/:id/active-borrows', LibraryController.getUserActiveBorrows);
router.post('/users', LibraryController.registerUser);
router.delete('/users/:id', LibraryController.deleteUser);

// ============ BORROW/RETURN ROUTES ============
router.get('/borrows', LibraryController.getAllBorrows);
router.get('/borrows/active', LibraryController.getActiveBorrows);
router.get('/borrows/overdue', LibraryController.getOverdueBorrows);
router.post('/borrows', LibraryController.borrowBook);
router.post('/borrows/:id/return', LibraryController.returnBook);

// ============ STATISTICS ROUTES ============
router.get('/statistics', LibraryController.getStatistics);

export default router;
