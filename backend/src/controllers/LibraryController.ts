import { Request, Response } from 'express';
import { LibraryService } from '../../../src/services/LibraryService';

// Singleton instance of LibraryService
const libraryService = new LibraryService();

export class LibraryController {
  // ============ BOOKS API ============

  // GET /api/books - Get all books
  static getAllBooks(req: Request, res: Response) {
    try {
      const books = libraryService.getAllBooks();
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/available - Get available books
  static getAvailableBooks(req: Request, res: Response) {
    try {
      const books = libraryService.getAvailableBooks();
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/:id - Get book by ID
  static getBookById(req: Request, res: Response) {
    try {
      const book = libraryService.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }
      res.json({ success: true, data: book });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/books - Add new book
  static addBook(req: Request, res: Response) {
    try {
      const { title, author, isbn, publishYear, category } = req.body;

      if (!title || !author || !isbn || !publishYear || !category) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      const book = libraryService.addBook(title, author, isbn, publishYear, category);
      res.status(201).json({ success: true, data: book });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE /api/books/:id - Delete book
  static deleteBook(req: Request, res: Response) {
    try {
      const result = libraryService.removeBook(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/title/:query - Search books by title
  static searchBooksByTitle(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByTitle(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/author/:query - Search books by author
  static searchBooksByAuthor(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByAuthor(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/category/:query - Search books by category
  static searchBooksByCategory(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByCategory(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ USERS API ============

  // GET /api/users - Get all users
  static getAllUsers(req: Request, res: Response) {
    try {
      const users = libraryService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id - Get user by ID
  static getUserById(req: Request, res: Response) {
    try {
      const user = libraryService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/users - Register new user
  static registerUser(req: Request, res: Response) {
    try {
      const { name, email, phone, address } = req.body;

      if (!name || !email || !phone || !address) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      const user = libraryService.registerUser(name, email, phone, address);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE /api/users/:id - Delete user
  static deleteUser(req: Request, res: Response) {
    try {
      const result = libraryService.removeUser(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id/borrows - Get user's borrow records
  static getUserBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getUserBorrowRecords(req.params.id);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id/active-borrows - Get user's active borrow records
  static getUserActiveBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getUserActiveBorrowRecords(req.params.id);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ BORROW/RETURN API ============

  // POST /api/borrows - Borrow book
  static borrowBook(req: Request, res: Response) {
    try {
      const { userId, bookId, borrowDays } = req.body;

      if (!userId || !bookId) {
        return res.status(400).json({
          success: false,
          error: 'Missing userId or bookId'
        });
      }

      const record = libraryService.borrowBook(userId, bookId, borrowDays);
      res.status(201).json({ success: true, data: record });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // POST /api/borrows/:id/return - Return book
  static returnBook(req: Request, res: Response) {
    try {
      const record = libraryService.returnBook(req.params.id);
      res.json({ success: true, data: record });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows - Get all borrow records
  static getAllBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getAllBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows/active - Get active borrow records
  static getActiveBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getActiveBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows/overdue - Get overdue borrow records
  static getOverdueBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getOverdueBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ STATISTICS API ============

  // GET /api/statistics - Get statistics
  static getStatistics(req: Request, res: Response) {
    try {
      const stats = libraryService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
