import { query, transaction } from '../connection';
import { BorrowRecord, BorrowStatus } from '../../../src/models/BorrowRecord';
import { UserRepository } from './UserRepository';
import { BookRepository } from './BookRepository';

export class BorrowRecordRepository {
  // Get all borrow records
  static async findAll(): Promise<BorrowRecord[]> {
    const result = await query(
      'SELECT * FROM borrow_records ORDER BY borrow_date DESC'
    );
    return result.rows.map(row => this.mapRowToBorrowRecord(row));
  }

  // Get borrow record by ID
  static async findById(id: string): Promise<BorrowRecord | null> {
    const result = await query(
      'SELECT * FROM borrow_records WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? this.mapRowToBorrowRecord(result.rows[0]) : null;
  }

  // Get active borrow records
  static async findActive(): Promise<BorrowRecord[]> {
    const result = await query(
      `SELECT * FROM borrow_records
       WHERE status IN ('ACTIVE', 'OVERDUE')
       ORDER BY due_date ASC`
    );
    return result.rows.map(row => this.mapRowToBorrowRecord(row));
  }

  // Get overdue borrow records
  static async findOverdue(): Promise<BorrowRecord[]> {
    // First update overdue status
    await query(`
      UPDATE borrow_records
      SET status = 'OVERDUE'
      WHERE status = 'ACTIVE' AND due_date < CURRENT_TIMESTAMP
    `);

    const result = await query(
      `SELECT * FROM borrow_records
       WHERE status = 'OVERDUE'
       ORDER BY due_date ASC`
    );
    return result.rows.map(row => this.mapRowToBorrowRecord(row));
  }

  // Get borrow records by user ID
  static async findByUserId(userId: string): Promise<BorrowRecord[]> {
    const result = await query(
      'SELECT * FROM borrow_records WHERE user_id = $1 ORDER BY borrow_date DESC',
      [userId]
    );
    return result.rows.map(row => this.mapRowToBorrowRecord(row));
  }

  // Get active borrow records by user ID
  static async findActiveByUserId(userId: string): Promise<BorrowRecord[]> {
    const result = await query(
      `SELECT * FROM borrow_records
       WHERE user_id = $1 AND status IN ('ACTIVE', 'OVERDUE')
       ORDER BY due_date ASC`,
      [userId]
    );
    return result.rows.map(row => this.mapRowToBorrowRecord(row));
  }

  // Create new borrow record (with transaction)
  static async create(record: Partial<BorrowRecord>): Promise<BorrowRecord> {
    return await transaction(async (client) => {
      // Insert borrow record
      const result = await client.query(
        `INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          record.id,
          record.bookId,
          record.userId,
          record.borrowDate || new Date(),
          record.dueDate,
          record.status || 'ACTIVE'
        ]
      );

      // Update book status to BORROWED
      await client.query(
        'UPDATE books SET status = $1 WHERE id = $2',
        ['BORROWED', record.bookId]
      );

      // Increment user's borrowed books count
      await client.query(
        'UPDATE users SET borrowed_books_count = borrowed_books_count + 1 WHERE id = $1',
        [record.userId]
      );

      return this.mapRowToBorrowRecord(result.rows[0]);
    });
  }

  // Return book (with transaction)
  static async returnBook(id: string): Promise<BorrowRecord | null> {
    return await transaction(async (client) => {
      // Update borrow record
      const result = await client.query(
        `UPDATE borrow_records
         SET return_date = CURRENT_TIMESTAMP, status = 'RETURNED'
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const record = result.rows[0];

      // Update book status to AVAILABLE
      await client.query(
        'UPDATE books SET status = $1 WHERE id = $2',
        ['AVAILABLE', record.book_id]
      );

      // Decrement user's borrowed books count
      await client.query(
        'UPDATE users SET borrowed_books_count = GREATEST(borrowed_books_count - 1, 0) WHERE id = $1',
        [record.user_id]
      );

      return this.mapRowToBorrowRecord(record);
    });
  }

  // Update borrow record
  static async update(id: string, record: Partial<BorrowRecord>): Promise<BorrowRecord | null> {
    const result = await query(
      `UPDATE borrow_records
       SET status = COALESCE($2, status),
           return_date = COALESCE($3, return_date)
       WHERE id = $1
       RETURNING *`,
      [id, record.status, record.returnDate]
    );
    return result.rows.length > 0 ? this.mapRowToBorrowRecord(result.rows[0]) : null;
  }

  // Delete borrow record
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM borrow_records WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Get statistics
  static async getStatistics() {
    const result = await query('SELECT * FROM library_statistics');
    return result.rows[0];
  }

  // Map database row to BorrowRecord object
  private static mapRowToBorrowRecord(row: any): BorrowRecord {
    const record = new BorrowRecord(
      row.id,
      row.book_id,
      row.user_id,
      0 // borrowDays not needed from database
    );
    record.borrowDate = row.borrow_date;
    record.dueDate = row.due_date;
    record.returnDate = row.return_date;
    record.status = row.status as BorrowStatus;
    return record;
  }
}
