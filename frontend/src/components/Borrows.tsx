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
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await borrowsAPI.borrow(formData);
      setMessage({ type: 'success', text: 'Mượn sách thành công!' });
      setShowForm(false);
      setFormData({
        userId: '',
        bookId: '',
        borrowDays: 14,
      });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi mượn sách' });
    }
  };

  const handleReturn = async (id: string) => {
    if (!window.confirm('Xác nhận trả sách?')) return;

    try {
      await borrowsAPI.return(id);
      setMessage({ type: 'success', text: 'Trả sách thành công!' });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi trả sách' });
    }
  };

  const getStatusBadge = (status: BorrowStatus) => {
    const badges = {
      [BorrowStatus.ACTIVE]: 'badge-success',
      [BorrowStatus.RETURNED]: 'badge-info',
      [BorrowStatus.OVERDUE]: 'badge-danger',
    };

    const labels = {
      [BorrowStatus.ACTIVE]: 'Đang mượn',
      [BorrowStatus.RETURNED]: 'Đã trả',
      [BorrowStatus.OVERDUE]: 'Quá hạn',
    };

    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getBookTitle = (bookId: string) => {
    // Tìm trong danh sách borrows hiện tại
    const allBooks = [...books];
    // Có thể cần load thêm thông tin sách từ API
    return bookId;
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
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
          <h2>Quản Lý Mượn/Trả Sách</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : '+ Mượn Sách'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Người mượn *</label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                >
                  <option value="">-- Chọn người dùng --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.id}) - Đang mượn: {user.borrowedBooksCount}/{user.maxBorrowLimit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sách *</label>
                <select
                  required
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                >
                  <option value="">-- Chọn sách --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author} ({book.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số ngày mượn *</label>
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
            <button type="submit" className="btn btn-primary">Cho Mượn</button>
          </form>
        )}

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Đang hoạt động
          </button>
          <button
            className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('overdue')}
          >
            Quá hạn
          </button>
        </div>

        {borrows.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có phiếu mượn nào</h3>
            <p>Hãy tạo phiếu mượn đầu tiên</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sách</th>
                <th>Người mượn</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
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
                        Trả sách
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
