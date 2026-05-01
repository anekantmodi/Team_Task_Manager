import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password length should not be less than 6');
    }
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-blob1" style={{ background: 'rgba(168, 85, 247, 0.2)' }}></div>
      <div className="auth-bg-blob2"></div>
      
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}>TM</div>
          <h2>Create Account</h2>
          <p>Join TaskMaster today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Min. 6 characters"
              required
              minLength="6"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
              style={{ appearance: 'none' }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            Sign Up
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
