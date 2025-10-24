import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import Users from './components/Users';
import Borrows from './components/Borrows';
import './styles/App.css';

type Tab = 'dashboard' | 'books' | 'users' | 'borrows';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <Books />;
      case 'users':
        return <Users />;
      case 'borrows':
        return <Borrows />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Hệ Thống Quản Lý Thư Viện</h1>
        <p>Quản lý sách, người dùng và phiếu mượn một cách hiệu quả</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Tổng Quan
          </button>
          <button
            className={`tab ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Quản Lý Sách
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Người Dùng
          </button>
          <button
            className={`tab ${activeTab === 'borrows' ? 'active' : ''}`}
            onClick={() => setActiveTab('borrows')}
          >
            Mượn/Trả Sách
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default App;
