import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }}>
    <div style={{
      background: '#eef2ff',
      borderRadius: '50%',
      width: 100,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      marginBottom: '1.5rem',
    }}>
      🔍
    </div>
    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
      404
    </h1>
    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
      Page Not Found
    </h2>
    <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 420, marginBottom: '2rem', lineHeight: 1.6 }}>
      The page you're looking for doesn't exist or you may not have access to it.
    </p>
    <Link
      to="/"
      style={{
        background: '#4f46e5',
        color: '#fff',
        padding: '12px 32px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '1rem',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
      }}
    >
      ← Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
