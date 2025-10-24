import React, { useEffect, useState } from 'react';
import { booksAPI } from '../services/api';
import { Book, BookStatus } from '../types';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishYear: new Date().getFullYear(),
    category: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await booksAPI.add(formData);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      setShowForm(false);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publishYear: new Date().getFullYear(),
        category: '',
      });
      loadBooks();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error adding book' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await booksAPI.delete(id);
      setMessage({ type: 'success', text: 'Book deleted successfully!' });
      loadBooks();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error deleting book' });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    try {
      const response = await booksAPI.searchByTitle(searchQuery);
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const getStatusBadge = (status: BookStatus) => {
    const badges = {
      [BookStatus.AVAILABLE]: 'badge-success',
      [BookStatus.BORROWED]: 'badge-warning',
      [BookStatus.MAINTENANCE]: 'badge-info',
      [BookStatus.LOST]: 'badge-danger',
    };

    const labels = {
      [BookStatus.AVAILABLE]: 'Available',
      [BookStatus.BORROWED]: 'Borrowed',
      [BookStatus.MAINTENANCE]: 'Maintenance',
      [BookStatus.LOST]: 'Lost',
    };

    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ float: 'right', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Book Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : '+ Add Book'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Publish Year *</label>
                <input
                  type="number"
                  required
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Book</button>
          </form>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search books by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); loadBooks(); }}>Refresh</button>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            <h3>No books yet</h3>
            <p>Add your first book</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Year</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publishYear}</td>
                  <td>{book.category}</td>
                  <td>{getStatusBadge(book.status)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem' }}
                      onClick={() => handleDelete(book.id)}
                      disabled={book.status === BookStatus.BORROWED}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Books;
