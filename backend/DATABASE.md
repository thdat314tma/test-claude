# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the Library Management System.

## Prerequisites

- PostgreSQL 12 or higher installed
- Access to PostgreSQL command line (psql)

## Installation

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE library_db;

# Exit psql
\q
```

### 2. Run Schema

```bash
# From the backend directory
cd backend

# Run schema file
psql -U postgres -d library_db -f src/database/schema.sql
```

### 3. Load Sample Data (Optional)

```bash
psql -U postgres -d library_db -f src/database/seeds/sample-data.sql
```

### Using NPM Scripts

```bash
# Setup database schema
npm run db:setup

# Load sample data
npm run db:seed

# Reset database (schema + data)
npm run db:reset
```

## Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=your_password

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## Database Schema

### Tables

#### users
- `id` (VARCHAR(10), PRIMARY KEY) - User ID
- `name` (VARCHAR(255)) - Full name
- `email` (VARCHAR(255), UNIQUE) - Email address
- `phone` (VARCHAR(20)) - Phone number
- `address` (TEXT) - Address
- `registered_at` (TIMESTAMP) - Registration timestamp
- `borrowed_books_count` (INTEGER) - Current borrowed books
- `max_borrow_limit` (INTEGER) - Maximum borrow limit
- `created_at` (TIMESTAMP) - Created timestamp
- `updated_at` (TIMESTAMP) - Last updated timestamp

#### books
- `id` (VARCHAR(10), PRIMARY KEY) - Book ID
- `title` (VARCHAR(500)) - Book title
- `author` (VARCHAR(255)) - Author name
- `isbn` (VARCHAR(20), UNIQUE) - ISBN number
- `publish_year` (INTEGER) - Publication year
- `category` (VARCHAR(100)) - Book category
- `status` (book_status ENUM) - Book status
- `created_at` (TIMESTAMP) - Created timestamp
- `updated_at` (TIMESTAMP) - Last updated timestamp

#### borrow_records
- `id` (VARCHAR(10), PRIMARY KEY) - Record ID
- `book_id` (VARCHAR(10), FK) - Book reference
- `user_id` (VARCHAR(10), FK) - User reference
- `borrow_date` (TIMESTAMP) - Borrow date
- `due_date` (TIMESTAMP) - Due date
- `return_date` (TIMESTAMP, NULLABLE) - Return date
- `status` (borrow_status ENUM) - Record status
- `created_at` (TIMESTAMP) - Created timestamp
- `updated_at` (TIMESTAMP) - Last updated timestamp

### ENUM Types

- `book_status`: AVAILABLE, BORROWED, MAINTENANCE, LOST
- `borrow_status`: ACTIVE, RETURNED, OVERDUE

### Indexes

Performance indexes on:
- Book status, category, title, author
- User email, name
- Borrow record book_id, user_id, status, due_date

### Triggers

- Auto-update `updated_at` on record changes
- Auto-update book status on borrow
- Auto-update book status on return

### Views

- `library_statistics` - Real-time library statistics

## Useful PostgreSQL Commands

### Connect to Database
```bash
psql -U postgres -d library_db
```

### View Tables
```sql
\dt
```

### Describe Table
```sql
\d books
\d users
\d borrow_records
```

### View Data
```sql
SELECT * FROM books LIMIT 10;
SELECT * FROM users LIMIT 10;
SELECT * FROM borrow_records LIMIT 10;
```

### View Statistics
```sql
SELECT * FROM library_statistics;
```

### Check Overdue Books
```sql
SELECT br.*, b.title, u.name
FROM borrow_records br
JOIN books b ON br.book_id = b.id
JOIN users u ON br.user_id = u.id
WHERE br.status = 'OVERDUE';
```

### Update Overdue Status
```sql
SELECT check_overdue_borrows();
```

## Backup and Restore

### Backup Database
```bash
pg_dump -U postgres library_db > backup.sql
```

### Restore Database
```bash
psql -U postgres -d library_db < backup.sql
```

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

2. Check connection settings in `.env` file

3. Verify PostgreSQL accepts connections:
```bash
psql -U postgres -h localhost -p 5432
```

### Permission Issues

Grant permissions to user:
```sql
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS library_db;"
psql -U postgres -c "CREATE DATABASE library_db;"

# Run setup
npm run db:reset
```

## Performance Tuning

### View Query Performance
```sql
EXPLAIN ANALYZE SELECT * FROM books WHERE status = 'AVAILABLE';
```

### Monitor Active Connections
```sql
SELECT * FROM pg_stat_activity WHERE datname = 'library_db';
```

### View Index Usage
```sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Security Best Practices

1. Use strong passwords
2. Limit database user permissions
3. Use connection pooling
4. Enable SSL for production
5. Regular backups
6. Monitor database logs

## Migration Strategy

For production deployments:

1. Create migration files for schema changes
2. Use version control for database changes
3. Test migrations on staging first
4. Always backup before migration
5. Use transaction wrapping for safety

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
