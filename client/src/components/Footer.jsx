import React from 'react';
import { BarChart3 } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2.5rem 0',
      marginTop: '4rem',
      background: 'rgba(11, 15, 25, 0.9)',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          <BarChart3 size={18} color="var(--accent-primary)" />
          <span>Online Poll & Survey System</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Pollify. All rights reserved. Real-time analytics & survey builder.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
