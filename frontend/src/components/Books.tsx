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
      console.error('Lỗi khi tải sách:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await booksAPI.add(formData);
      setMessage({ type: 'success', text: 'Thêm sách thành công!' });
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
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi thêm sách' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sách này?')) return;

    try {
      await booksAPI.delete(id);
      setMessage({ type: 'success', text: 'Xóa sách thành công!' });
      loadBooks();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi xóa sách' });
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
      console.error('Lỗi khi tìm kiếm:', error);
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
      [BookStatus.AVAILABLE]: 'Có sẵn',
      [BookStatus.BORROWED]: 'Đang mượn',
      [BookStatus.MAINTENANCE]: 'Bảo trì',
      [BookStatus.LOST]: 'Mất',
    };

    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
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
          <h2>Quản Lý Sách</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : '+ Thêm Sách'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tác giả *</label>
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
                <label>Năm xuất bản *</label>
                <input
                  type="number"
                  required
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Thể loại *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Thêm Sách</button>
          </form>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sách theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Tìm kiếm</button>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); loadBooks(); }}>Làm mới</button>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có sách nào</h3>
            <p>Hãy thêm sách đầu tiên của bạn</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>ISBN</th>
                <th>Năm XB</th>
                <th>Thể loại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
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
                      Xóa
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
