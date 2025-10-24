-- Library Management System Database Schema
-- PostgreSQL

-- Create database (run this separately if needed)
-- CREATE DATABASE library_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS borrow_records CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE book_status AS ENUM ('AVAILABLE', 'BORROWED', 'MAINTENANCE', 'LOST');
CREATE TYPE borrow_status AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');

-- Users table
CREATE TABLE users (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    borrowed_books_count INTEGER DEFAULT 0,
    max_borrow_limit INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    publish_year INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    status book_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrow records table
CREATE TABLE borrow_records (
    id VARCHAR(10) PRIMARY KEY,
    book_id VARCHAR(10) NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    user_id VARCHAR(10) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status borrow_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(name);

CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);
CREATE INDEX idx_borrow_records_due_date ON borrow_records(due_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_borrow_records_updated_at BEFORE UPDATE ON borrow_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update book status when borrowed
CREATE OR REPLACE FUNCTION update_book_status_on_borrow()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ACTIVE' AND OLD.status IS NULL THEN
        UPDATE books SET status = 'BORROWED' WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER borrow_updates_book_status
AFTER INSERT ON borrow_records
FOR EACH ROW EXECUTE FUNCTION update_book_status_on_borrow();

-- Function to automatically update book status when returned
CREATE OR REPLACE FUNCTION update_book_status_on_return()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'RETURNED' AND OLD.status != 'RETURNED' THEN
        UPDATE books SET status = 'AVAILABLE' WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER return_updates_book_status
AFTER UPDATE ON borrow_records
FOR EACH ROW EXECUTE FUNCTION update_book_status_on_return();

-- Function to check and update overdue borrow records
CREATE OR REPLACE FUNCTION check_overdue_borrows()
RETURNS void AS $$
BEGIN
    UPDATE borrow_records
    SET status = 'OVERDUE'
    WHERE status = 'ACTIVE'
    AND due_date < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- View for statistics
CREATE OR REPLACE VIEW library_statistics AS
SELECT
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM books WHERE status = 'AVAILABLE') as available_books,
    (SELECT COUNT(*) FROM books WHERE status = 'BORROWED') as borrowed_books,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM borrow_records WHERE status IN ('ACTIVE', 'OVERDUE')) as active_borrows,
    (SELECT COUNT(*) FROM borrow_records WHERE status = 'OVERDUE') as overdue_borrows;

-- Comments for documentation
COMMENT ON TABLE users IS 'Library users who can borrow books';
COMMENT ON TABLE books IS 'Books available in the library';
COMMENT ON TABLE borrow_records IS 'Records of book borrowing transactions';
COMMENT ON COLUMN users.borrowed_books_count IS 'Current number of books borrowed by user';
COMMENT ON COLUMN users.max_borrow_limit IS 'Maximum number of books user can borrow simultaneously';
COMMENT ON COLUMN borrow_records.due_date IS 'Date when book should be returned';
