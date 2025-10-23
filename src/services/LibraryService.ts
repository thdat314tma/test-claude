import { Book } from '../models/Book';
import { User } from '../models/User';
import { BorrowRecord } from '../models/BorrowRecord';
import { BookStatus, BorrowStatus } from '../types';

export class LibraryService {
  private books: Map<string, Book>;
  private users: Map<string, User>;
  private borrowRecords: Map<string, BorrowRecord>;
  private bookIdCounter: number;
  private userIdCounter: number;
  private recordIdCounter: number;

  constructor() {
    this.books = new Map();
    this.users = new Map();
    this.borrowRecords = new Map();
    this.bookIdCounter = 1;
    this.userIdCounter = 1;
    this.recordIdCounter = 1;
  }

  // ============ QUẢN LÝ SÁCH ============

  // Thêm sách mới
  addBook(title: string, author: string, isbn: string, publishYear: number, category: string): Book {
    const bookId = `B${String(this.bookIdCounter++).padStart(4, '0')}`;
    const book = new Book(bookId, title, author, isbn, publishYear, category);
    this.books.set(bookId, book);
    return book;
  }

  // Xóa sách
  removeBook(bookId: string): boolean {
    const book = this.books.get(bookId);
    if (!book) {
      throw new Error(`Không tìm thấy sách với ID: ${bookId}`);
    }
    if (book.status === BookStatus.BORROWED) {
      throw new Error(`Không thể xóa sách đang được mượn: ${book.title}`);
    }
    return this.books.delete(bookId);
  }

  // Lấy thông tin sách
  getBook(bookId: string): Book | undefined {
    return this.books.get(bookId);
  }

  // Lấy tất cả sách
  getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }

  // Lấy sách có sẵn để mượn
  getAvailableBooks(): Book[] {
    return this.getAllBooks().filter(book => book.isAvailable());
  }

  // Tìm sách theo tiêu đề
  searchBooksByTitle(title: string): Book[] {
    return this.getAllBooks().filter(book =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Tìm sách theo tác giả
  searchBooksByAuthor(author: string): Book[] {
    return this.getAllBooks().filter(book =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // Tìm sách theo thể loại
  searchBooksByCategory(category: string): Book[] {
    return this.getAllBooks().filter(book =>
      book.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // ============ QUẢN LÝ NGƯỜI DÙNG ============

  // Đăng ký người dùng mới
  registerUser(name: string, email: string, phone: string, address: string): User {
    const userId = `U${String(this.userIdCounter++).padStart(4, '0')}`;
    const user = new User(userId, name, email, phone, address);
    this.users.set(userId, user);
    return user;
  }

  // Xóa người dùng
  removeUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
    }
    if (user.borrowedBooksCount > 0) {
      throw new Error(`Không thể xóa người dùng đang mượn sách: ${user.name}`);
    }
    return this.users.delete(userId);
  }

  // Lấy thông tin người dùng
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  // Lấy tất cả người dùng
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // ============ QUẢN LÝ MƯỢN/TRẢ SÁCH ============

  // Mượn sách
  borrowBook(userId: string, bookId: string, borrowDays: number = 14): BorrowRecord {
    const user = this.users.get(userId);
    const book = this.books.get(bookId);

    if (!user) {
      throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
    }
    if (!book) {
      throw new Error(`Không tìm thấy sách với ID: ${bookId}`);
    }
    if (!user.canBorrow()) {
      throw new Error(`Người dùng ${user.name} đã đạt giới hạn mượn sách`);
    }
    if (!book.isAvailable()) {
      throw new Error(`Sách "${book.title}" không có sẵn để mượn. Trạng thái: ${book.status}`);
    }

    // Tạo phiếu mượn
    const recordId = `R${String(this.recordIdCounter++).padStart(4, '0')}`;
    const record = new BorrowRecord(recordId, bookId, userId, borrowDays);

    // Cập nhật trạng thái
    book.markAsBorrowed();
    user.incrementBorrowedBooks();
    this.borrowRecords.set(recordId, record);

    return record;
  }

  // Trả sách
  returnBook(recordId: string): BorrowRecord {
    const record = this.borrowRecords.get(recordId);
    if (!record) {
      throw new Error(`Không tìm thấy phiếu mượn với ID: ${recordId}`);
    }
    if (record.status === BorrowStatus.RETURNED) {
      throw new Error('Sách đã được trả trước đó');
    }

    const book = this.books.get(record.bookId);
    const user = this.users.get(record.userId);

    if (!book || !user) {
      throw new Error('Không tìm thấy thông tin sách hoặc người dùng');
    }

    // Cập nhật trạng thái
    record.markAsReturned();
    book.markAsReturned();
    user.decrementBorrowedBooks();

    return record;
  }

  // Lấy tất cả phiếu mượn
  getAllBorrowRecords(): BorrowRecord[] {
    return Array.from(this.borrowRecords.values());
  }

  // Lấy phiếu mượn đang hoạt động
  getActiveBorrowRecords(): BorrowRecord[] {
    return this.getAllBorrowRecords().filter(record =>
      record.status === BorrowStatus.ACTIVE || record.status === BorrowStatus.OVERDUE
    );
  }

  // Lấy phiếu mượn của người dùng
  getUserBorrowRecords(userId: string): BorrowRecord[] {
    return this.getAllBorrowRecords().filter(record => record.userId === userId);
  }

  // Lấy phiếu mượn đang hoạt động của người dùng
  getUserActiveBorrowRecords(userId: string): BorrowRecord[] {
    return this.getUserBorrowRecords(userId).filter(record =>
      record.status === BorrowStatus.ACTIVE || record.status === BorrowStatus.OVERDUE
    );
  }

  // Lấy phiếu mượn quá hạn
  getOverdueBorrowRecords(): BorrowRecord[] {
    // Cập nhật trạng thái trước khi lấy
    this.getAllBorrowRecords().forEach(record => record.updateStatus());
    return this.getAllBorrowRecords().filter(record => record.status === BorrowStatus.OVERDUE);
  }

  // ============ THỐNG KÊ ============

  // Thống kê tổng quan
  getStatistics() {
    const totalBooks = this.books.size;
    const availableBooks = this.getAvailableBooks().length;
    const borrowedBooks = this.getAllBooks().filter(b => b.status === BookStatus.BORROWED).length;
    const totalUsers = this.users.size;
    const activeBorrows = this.getActiveBorrowRecords().length;
    const overdueBorrows = this.getOverdueBorrowRecords().length;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      activeBorrows,
      overdueBorrows
    };
  }

  // In thống kê
  printStatistics(): void {
    const stats = this.getStatistics();
    console.log('\n========== THỐNG KÊ THƯ VIỆN ==========');
    console.log(`Tổng số sách: ${stats.totalBooks}`);
    console.log(`  - Sách có sẵn: ${stats.availableBooks}`);
    console.log(`  - Sách đang mượn: ${stats.borrowedBooks}`);
    console.log(`Tổng số người dùng: ${stats.totalUsers}`);
    console.log(`Phiếu mượn đang hoạt động: ${stats.activeBorrows}`);
    console.log(`Phiếu mượn quá hạn: ${stats.overdueBorrows}`);
    console.log('========================================\n');
  }
}
