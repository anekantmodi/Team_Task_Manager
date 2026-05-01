import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-icon">TM</div>
        <h1 className="logo-text">TaskMaster</h1>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div className="nav-link" style={{ cursor: 'pointer' }}>
          <Settings size={20} />
          Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
