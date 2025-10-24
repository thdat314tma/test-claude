import React, { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { User } from '../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersAPI.register(formData);
      setMessage({ type: 'success', text: 'Đăng ký người dùng thành công!' });
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi đăng ký người dùng' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await usersAPI.delete(id);
      setMessage({ type: 'success', text: 'Xóa người dùng thành công!' });
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Lỗi khi xóa người dùng' });
    }
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
          <h2>Quản Lý Người Dùng</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : '+ Đăng Ký Người Dùng'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Đăng Ký</button>
          </form>
        )}

        {users.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có người dùng nào</h3>
            <p>Hãy đăng ký người dùng đầu tiên</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Đang mượn</th>
                <th>Giới hạn</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>
                    <span className={user.borrowedBooksCount > 0 ? 'badge badge-warning' : 'badge badge-success'}>
                      {user.borrowedBooksCount}
                    </span>
                  </td>
                  <td>{user.maxBorrowLimit}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem' }}
                      onClick={() => handleDelete(user.id)}
                      disabled={user.borrowedBooksCount > 0}
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

export default Users;
