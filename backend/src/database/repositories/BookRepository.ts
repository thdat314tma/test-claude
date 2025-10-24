import { query } from '../connection';
import { Book, BookStatus } from '../../../src/models/Book';

export class BookRepository {
  // Get all books
  static async findAll(): Promise<Book[]> {
    const result = await query('SELECT * FROM books ORDER BY created_at DESC');
    return result.rows.map(row => this.mapRowToBook(row));
  }

  // Get book by ID
  static async findById(id: string): Promise<Book | null> {
    const result = await query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToBook(result.rows[0]) : null;
  }

  // Get available books
  static async findAvailable(): Promise<Book[]> {
    const result = await query(
      'SELECT * FROM books WHERE status = $1 ORDER BY title',
      ['AVAILABLE']
    );
    return result.rows.map(row => this.mapRowToBook(row));
  }

  // Create new book
  static async create(book: Partial<Book>): Promise<Book> {
    const result = await query(
      `INSERT INTO books (id, title, author, isbn, publish_year, category, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [book.id, book.title, book.author, book.isbn, book.publishYear, book.category, book.status || 'AVAILABLE']
    );
    return this.mapRowToBook(result.rows[0]);
  }

  // Update book
  static async update(id: string, book: Partial<Book>): Promise<Book | null> {
    const result = await query(
      `UPDATE books
       SET title = COALESCE($2, title),
           author = COALESCE($3, author),
           status = COALESCE($4, status)
       WHERE id = $1
       RETURNING *`,
      [id, book.title, book.author, book.status]
    );
    return result.rows.length > 0 ? this.mapRowToBook(result.rows[0]) : null;
  }

  // Delete book
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM books WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Search by title
  static async searchByTitle(query: string): Promise<Book[]> {
    const result = await this.query(
      'SELECT * FROM books WHERE title ILIKE $1 ORDER BY title',
      [`%${query}%`]
    );
    return result.rows.map(row => this.mapRowToBook(row));
  }

  // Search by author
  static async searchByAuthor(authorQuery: string): Promise<Book[]> {
    const result = await query(
      'SELECT * FROM books WHERE author ILIKE $1 ORDER BY author, title',
      [`%${authorQuery}%`]
    );
    return result.rows.map(row => this.mapRowToBook(row));
  }

  // Search by category
  static async searchByCategory(categoryQuery: string): Promise<Book[]> {
    const result = await query(
      'SELECT * FROM books WHERE category ILIKE $1 ORDER BY title',
      [`%${categoryQuery}%`]
    );
    return result.rows.map(row => this.mapRowToBook(row));
  }

  // Map database row to Book object
  private static mapRowToBook(row: any): Book {
    const book = new Book(
      row.id,
      row.title,
      row.author,
      row.isbn,
      row.publish_year,
      row.category,
      row.status as BookStatus
    );
    book.createdAt = row.created_at;
    return book;
  }

  // Use the imported query function
  private static query = query;
}
