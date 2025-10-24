-- Sample data for Library Management System
-- Run this after schema.sql to populate with test data

-- Insert sample users
INSERT INTO users (id, name, email, phone, address, borrowed_books_count, max_borrow_limit) VALUES
('U0001', 'John Smith', 'john.smith@email.com', '555-0101', '123 Main St, New York, NY'),
('U0002', 'Emma Johnson', 'emma.j@email.com', '555-0102', '456 Oak Ave, Los Angeles, CA'),
('U0003', 'Michael Brown', 'michael.b@email.com', '555-0103', '789 Pine Rd, Chicago, IL'),
('U0004', 'Sarah Davis', 'sarah.d@email.com', '555-0104', '321 Elm St, Houston, TX'),
('U0005', 'David Wilson', 'david.w@email.com', '555-0105', '654 Maple Dr, Phoenix, AZ');

-- Insert sample books
INSERT INTO books (id, title, author, isbn, publish_year, category, status) VALUES
-- Classic Literature
('B0001', 'To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 1960, 'Classic Literature', 'AVAILABLE'),
('B0002', '1984', 'George Orwell', '978-0451524935', 1949, 'Classic Literature', 'AVAILABLE'),
('B0003', 'Pride and Prejudice', 'Jane Austen', '978-0141439518', 1813, 'Classic Literature', 'AVAILABLE'),
('B0004', 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 1925, 'Classic Literature', 'AVAILABLE'),

-- Science Fiction
('B0005', 'Dune', 'Frank Herbert', '978-0441172719', 1965, 'Science Fiction', 'AVAILABLE'),
('B0006', 'Foundation', 'Isaac Asimov', '978-0553293357', 1951, 'Science Fiction', 'AVAILABLE'),
('B0007', 'Neuromancer', 'William Gibson', '978-0441569595', 1984, 'Science Fiction', 'AVAILABLE'),

-- Self-Help & Business
('B0008', 'How to Win Friends and Influence People', 'Dale Carnegie', '978-0671027032', 1936, 'Self-Help', 'AVAILABLE'),
('B0009', 'Think and Grow Rich', 'Napoleon Hill', '978-1585424337', 1937, 'Self-Help', 'AVAILABLE'),
('B0010', 'The 7 Habits of Highly Effective People', 'Stephen Covey', '978-1982137274', 1989, 'Self-Help', 'AVAILABLE'),

-- Non-Fiction
('B0011', 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 2011, 'History', 'AVAILABLE'),
('B0012', 'Educated', 'Tara Westover', '978-0399590504', 2018, 'Biography', 'AVAILABLE'),
('B0013', 'The Immortal Life of Henrietta Lacks', 'Rebecca Skloot', '978-1400052189', 2010, 'Science', 'AVAILABLE'),

-- Technology & Programming
('B0014', 'Clean Code', 'Robert C. Martin', '978-0132350884', 2008, 'Programming', 'AVAILABLE'),
('B0015', 'The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 1999, 'Programming', 'AVAILABLE'),
('B0016', 'Design Patterns', 'Gang of Four', '978-0201633612', 1994, 'Programming', 'AVAILABLE'),

-- Fiction
('B0017', 'The Alchemist', 'Paulo Coelho', '978-0062315007', 1988, 'Fiction', 'AVAILABLE'),
('B0018', 'The Kite Runner', 'Khaled Hosseini', '978-1594631931', 2003, 'Fiction', 'AVAILABLE'),
('B0019', 'Life of Pi', 'Yann Martel', '978-0156027328', 2001, 'Fiction', 'AVAILABLE'),
('B0020', 'The Book Thief', 'Markus Zusak', '978-0375842207', 2005, 'Fiction', 'AVAILABLE');

-- Insert some borrow records (active borrows)
INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, status) VALUES
('R0001', 'B0001', 'U0001', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '11 days', 'ACTIVE'),
('R0002', 'B0005', 'U0002', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '9 days', 'ACTIVE'),
('R0003', 'B0014', 'U0003', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days', 'ACTIVE');

-- Update book statuses for borrowed books
UPDATE books SET status = 'BORROWED' WHERE id IN ('B0001', 'B0005', 'B0014');

-- Update user borrowed counts
UPDATE users SET borrowed_books_count = 1 WHERE id IN ('U0001', 'U0002', 'U0003');

-- Insert some returned records (history)
INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, return_date, status) VALUES
('R0004', 'B0008', 'U0001', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '15 days', 'RETURNED'),
('R0005', 'B0011', 'U0002', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'RETURNED'),
('R0006', 'B0002', 'U0004', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'RETURNED');

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Books', COUNT(*) FROM books
UNION ALL
SELECT 'Borrow Records', COUNT(*) FROM borrow_records;

-- Show statistics
SELECT * FROM library_statistics;
