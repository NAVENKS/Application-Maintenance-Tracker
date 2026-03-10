import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('amt_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('amt_token') || null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('amt_token', token);
    localStorage.setItem('amt_user', JSON.stringify(user));
    setToken(token);
    setUser(user);

    // Redirect based on role
    switch (user.role) {
      case 'USER':      navigate('/user/dashboard'); break;
      case 'ADMIN':     navigate('/admin/dashboard'); break;
      case 'DEVELOPER': navigate('/developer/dashboard'); break;
      case 'TESTER':    navigate('/tester/dashboard'); break;
      default:          navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('amt_token');
    localStorage.removeItem('amt_user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
