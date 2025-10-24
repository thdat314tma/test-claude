import React, { useEffect, useState } from 'react';
import { borrowsAPI, booksAPI, usersAPI } from '../services/api';
import { BorrowRecord, Book, User, BorrowStatus } from '../types';

const Borrows: React.FC = () => {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue'>('all');

  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    borrowDays: 14,
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [borrowsRes, booksRes, usersRes] = await Promise.all([
        filter === 'all' ? borrowsAPI.getAll() :
        filter === 'active' ? borrowsAPI.getActive() :
        borrowsAPI.getOverdue(),
        booksAPI.getAvailable(),
        usersAPI.getAll(),
      ]);

      setBorrows(borrowsRes.data.data);
      setBooks(booksRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await borrowsAPI.borrow(formData);
      setMessage({ type: 'success', text: 'Book borrowed successfully!' });
      setShowForm(false);
      setFormData({
        userId: '',
        bookId: '',
        borrowDays: 14,
      });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error borrowing book' });
    }
  };

  const handleReturn = async (id: string) => {
    if (!window.confirm('Confirm book return?')) return;

    try {
      await borrowsAPI.return(id);
      setMessage({ type: 'success', text: 'Book returned successfully!' });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error returning book' });
    }
  };

  const getStatusBadge = (status: BorrowStatus) => {
    const badges = {
      [BorrowStatus.ACTIVE]: 'badge-success',
      [BorrowStatus.RETURNED]: 'badge-info',
      [BorrowStatus.OVERDUE]: 'badge-danger',
    };

    const labels = {
      [BorrowStatus.ACTIVE]: 'Active',
      [BorrowStatus.RETURNED]: 'Returned',
      [BorrowStatus.OVERDUE]: 'Overdue',
    };

    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US');
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
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
          <h2>Borrow/Return Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : '+ Borrow Book'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Borrower *</label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                >
                  <option value="">-- Select User --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.id}) - Borrowed: {user.borrowedBooksCount}/{user.maxBorrowLimit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Book *</label>
                <select
                  required
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                >
                  <option value="">-- Select Book --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author} ({book.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Borrow Days *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="90"
                  value={formData.borrowDays}
                  onChange={(e) => setFormData({ ...formData, borrowDays: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Borrow</button>
          </form>
        )}

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
        </div>

        {borrows.length === 0 ? (
          <div className="empty-state">
            <h3>No borrow records yet</h3>
            <p>Create your first borrow record</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td>{borrow.id}</td>
                  <td>{borrow.bookId}</td>
                  <td>{getUserName(borrow.userId)}</td>
                  <td>{formatDate(borrow.borrowDate)}</td>
                  <td>{formatDate(borrow.dueDate)}</td>
                  <td>{borrow.returnDate ? formatDate(borrow.returnDate) : '-'}</td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    {borrow.status !== BorrowStatus.RETURNED && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={() => handleReturn(borrow.id)}
                      >
                        Return
                      </button>
                    )}
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

export default Borrows;
