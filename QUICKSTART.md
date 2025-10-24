# Quick Start Guide - Library Management System

Get up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Prerequisites

Install these before starting:
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### 2. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd test-claude

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

```bash
# Start PostgreSQL (if not running)
# macOS:
brew services start postgresql

# Ubuntu/Linux:
sudo systemctl start postgresql

# Create database
createdb library_db

# Or using psql:
psql -U postgres -c "CREATE DATABASE library_db;"

# Run database setup (from backend directory)
cd backend
npm run db:setup
npm run db:seed
```

### 4. Configure Environment

```bash
# In backend directory
cp .env.example .env

# Edit .env file with your PostgreSQL credentials
# Default settings usually work for local development:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Start the Application

Open **two terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start at: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will open automatically at: http://localhost:3000

## ✅ Verify Installation

1. Open http://localhost:3000 in your browser
2. You should see the Library Management System dashboard
3. Sample data is pre-loaded:
   - 20 books (various categories)
   - 5 users
   - 6 borrow records

## 📚 Quick Tour

### Dashboard
- View statistics: total books, available books, active borrows, etc.

### Books Management
- Click "Books" tab
- Add new books using "+ Add Book" button
- Search books by title
- Delete books (if not borrowed)

### User Management
- Click "Users" tab
- Register new users with "+ Register User"
- View borrowed books count

### Borrow/Return
- Click "Borrow/Return" tab
- Borrow books using "+ Borrow Book"
- Filter by status: All, Active, Overdue
- Return books using "Return" button

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -l

# If not running, start it:
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

### Port Already in Use

Backend (3001):
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

Frontend (3000):
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### npm install errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🎯 What's Next?

- Explore the code in `/backend/src` and `/frontend/src`
- Read [DATABASE.md](backend/DATABASE.md) for database details
- Read [README.md](README.md) for full documentation
- Check [API endpoints](README.md#rest-api-endpoints)

## 📖 Sample Data Overview

**Users:**
- John Smith (U0001)
- Emma Johnson (U0002)
- Michael Brown (U0003)
- Sarah Davis (U0004)
- David Wilson (U0005)

**Books:** 20 books across categories:
- Classic Literature (4 books)
- Science Fiction (3 books)
- Self-Help (3 books)
- History & Biography (3 books)
- Programming (3 books)
- Fiction (4 books)

**Active Borrows:** 3 active records for demo

## 🛠️ Development Commands

**Backend:**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run db:setup  # Setup database schema
npm run db:seed   # Load sample data
npm run db:reset  # Reset database (setup + seed)
```

**Frontend:**
```bash
npm start         # Start development server
npm run build     # Build for production
npm test          # Run tests
```

## 🌐 API Testing

Test the API using curl:

```bash
# Get all books
curl http://localhost:3001/api/books

# Get statistics
curl http://localhost:3001/api/statistics

# Add a book
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "isbn": "978-1234567890",
    "publishYear": 2024,
    "category": "Technology"
  }'
```

## 💡 Tips

1. Keep both backend and frontend running
2. Backend auto-reloads on code changes (nodemon)
3. Frontend hot-reloads on save
4. Check browser console for errors
5. Check terminal for server errors

## 📞 Need Help?

- Check the [README.md](README.md) for full documentation
- Read [DATABASE.md](backend/DATABASE.md) for database help
- Review the code comments for implementation details

Happy coding! 🎉
