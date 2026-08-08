import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, PlusCircle, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.4rem', fontWeight: '800' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <BarChart3 size={22} />
          </div>
          <span style={{
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Pollify
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/builder" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <PlusCircle size={16} />
                Create Survey
              </Link>
              <div style={{
                height: '24px',
                width: '1px',
                background: 'var(--border-color)'
              }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hi, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ gap: '0.4rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <UserPlus size={16} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
