import { query } from '../connection';
import { User } from '../../../src/models/User';

export class UserRepository {
  // Get all users
  static async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY name');
    return result.rows.map(row => this.mapRowToUser(row));
  }

  // Get user by ID
  static async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // Get user by email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // Create new user
  static async create(user: Partial<User>): Promise<User> {
    const result = await query(
      `INSERT INTO users (id, name, email, phone, address, max_borrow_limit)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.id, user.name, user.email, user.phone, user.address, user.maxBorrowLimit || 5]
    );
    return this.mapRowToUser(result.rows[0]);
  }

  // Update user
  static async update(id: string, user: Partial<User>): Promise<User | null> {
    const result = await query(
      `UPDATE users
       SET name = COALESCE($2, name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address)
       WHERE id = $1
       RETURNING *`,
      [id, user.name, user.email, user.phone, user.address]
    );
    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // Update borrowed books count
  static async updateBorrowedCount(id: string, count: number): Promise<void> {
    await query(
      'UPDATE users SET borrowed_books_count = $2 WHERE id = $1',
      [id, count]
    );
  }

  // Increment borrowed books count
  static async incrementBorrowedCount(id: string): Promise<void> {
    await query(
      'UPDATE users SET borrowed_books_count = borrowed_books_count + 1 WHERE id = $1',
      [id]
    );
  }

  // Decrement borrowed books count
  static async decrementBorrowedCount(id: string): Promise<void> {
    await query(
      'UPDATE users SET borrowed_books_count = GREATEST(borrowed_books_count - 1, 0) WHERE id = $1',
      [id]
    );
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Map database row to User object
  private static mapRowToUser(row: any): User {
    const user = new User(
      row.id,
      row.name,
      row.email,
      row.phone,
      row.address,
      row.max_borrow_limit
    );
    user.borrowedBooksCount = row.borrowed_books_count;
    user.registeredAt = row.registered_at;
    return user;
  }
}
