import React, { useEffect, useState } from 'react';
import { statisticsAPI } from '../services/api';
import { Statistics } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await statisticsAPI.get();
      setStats(response.data.data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!stats) {
    return <div className="alert alert-error">Không thể tải thống kê</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Thống Kê Tổng Quan</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <h3>Tổng Số Sách</h3>
            <div className="value">{stats.totalBooks}</div>
          </div>
          <div className="stat-card success">
            <h3>Sách Có Sẵn</h3>
            <div className="value">{stats.availableBooks}</div>
          </div>
          <div className="stat-card warning">
            <h3>Đang Mượn</h3>
            <div className="value">{stats.borrowedBooks}</div>
          </div>
          <div className="stat-card primary">
            <h3>Người Dùng</h3>
            <div className="value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card success">
            <h3>Phiếu Mượn Hoạt Động</h3>
            <div className="value">{stats.activeBorrows}</div>
          </div>
          <div className="stat-card danger">
            <h3>Quá Hạn</h3>
            <div className="value">{stats.overdueBorrows}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
