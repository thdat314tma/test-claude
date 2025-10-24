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
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stats) {
    return <div className="alert alert-error">Unable to load statistics</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Overview Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <h3>Total Books</h3>
            <div className="value">{stats.totalBooks}</div>
          </div>
          <div className="stat-card success">
            <h3>Available Books</h3>
            <div className="value">{stats.availableBooks}</div>
          </div>
          <div className="stat-card warning">
            <h3>Borrowed</h3>
            <div className="value">{stats.borrowedBooks}</div>
          </div>
          <div className="stat-card primary">
            <h3>Users</h3>
            <div className="value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card success">
            <h3>Active Borrows</h3>
            <div className="value">{stats.activeBorrows}</div>
          </div>
          <div className="stat-card danger">
            <h3>Overdue</h3>
            <div className="value">{stats.overdueBorrows}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
