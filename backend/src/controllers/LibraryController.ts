import { Request, Response } from 'express';
import { LibraryService } from '../../../src/services/LibraryService';

// Singleton instance của LibraryService
const libraryService = new LibraryService();

export class LibraryController {
  // ============ BOOKS API ============

  // GET /api/books - Lấy tất cả sách
  static getAllBooks(req: Request, res: Response) {
    try {
      const books = libraryService.getAllBooks();
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/available - Lấy sách có sẵn
  static getAvailableBooks(req: Request, res: Response) {
    try {
      const books = libraryService.getAvailableBooks();
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/:id - Lấy sách theo ID
  static getBookById(req: Request, res: Response) {
    try {
      const book = libraryService.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy sách' });
      }
      res.json({ success: true, data: book });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/books - Thêm sách mới
  static addBook(req: Request, res: Response) {
    try {
      const { title, author, isbn, publishYear, category } = req.body;

      if (!title || !author || !isbn || !publishYear || !category) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu thông tin bắt buộc'
        });
      }

      const book = libraryService.addBook(title, author, isbn, publishYear, category);
      res.status(201).json({ success: true, data: book });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE /api/books/:id - Xóa sách
  static deleteBook(req: Request, res: Response) {
    try {
      const result = libraryService.removeBook(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/title/:query - Tìm sách theo tiêu đề
  static searchBooksByTitle(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByTitle(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/author/:query - Tìm sách theo tác giả
  static searchBooksByAuthor(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByAuthor(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/books/search/category/:query - Tìm sách theo thể loại
  static searchBooksByCategory(req: Request, res: Response) {
    try {
      const books = libraryService.searchBooksByCategory(req.params.query);
      res.json({ success: true, data: books });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ USERS API ============

  // GET /api/users - Lấy tất cả người dùng
  static getAllUsers(req: Request, res: Response) {
    try {
      const users = libraryService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id - Lấy người dùng theo ID
  static getUserById(req: Request, res: Response) {
    try {
      const user = libraryService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/users - Đăng ký người dùng mới
  static registerUser(req: Request, res: Response) {
    try {
      const { name, email, phone, address } = req.body;

      if (!name || !email || !phone || !address) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu thông tin bắt buộc'
        });
      }

      const user = libraryService.registerUser(name, email, phone, address);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE /api/users/:id - Xóa người dùng
  static deleteUser(req: Request, res: Response) {
    try {
      const result = libraryService.removeUser(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id/borrows - Lấy phiếu mượn của người dùng
  static getUserBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getUserBorrowRecords(req.params.id);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/users/:id/active-borrows - Lấy phiếu mượn đang hoạt động
  static getUserActiveBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getUserActiveBorrowRecords(req.params.id);
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ BORROW/RETURN API ============

  // POST /api/borrows - Mượn sách
  static borrowBook(req: Request, res: Response) {
    try {
      const { userId, bookId, borrowDays } = req.body;

      if (!userId || !bookId) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu userId hoặc bookId'
        });
      }

      const record = libraryService.borrowBook(userId, bookId, borrowDays);
      res.status(201).json({ success: true, data: record });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // POST /api/borrows/:id/return - Trả sách
  static returnBook(req: Request, res: Response) {
    try {
      const record = libraryService.returnBook(req.params.id);
      res.json({ success: true, data: record });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows - Lấy tất cả phiếu mượn
  static getAllBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getAllBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows/active - Lấy phiếu mượn đang hoạt động
  static getActiveBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getActiveBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/borrows/overdue - Lấy phiếu mượn quá hạn
  static getOverdueBorrows(req: Request, res: Response) {
    try {
      const records = libraryService.getOverdueBorrowRecords();
      res.json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ STATISTICS API ============

  // GET /api/statistics - Lấy thống kê
  static getStatistics(req: Request, res: Response) {
    try {
      const stats = libraryService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
