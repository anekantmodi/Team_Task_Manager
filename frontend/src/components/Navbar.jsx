import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Search tasks, projects..." 
          className="search-input"
        />
      </div>

      <div className="nav-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button 
            onClick={handleLogout}
            className="icon-btn"
            title="Logout"
            style={{ marginLeft: '8px' }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
