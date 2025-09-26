// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(() => {
    // ✅ Load user from localStorage if available
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // ✅ Validate cookie-based JWT
  const validateToken = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/validateToken', {
        withCredentials: true,
      });

      // Merge backend user with local user (preserve token if stored)
      const validatedUser = { ...user, ...res.data.user };

      setUser(validatedUser);
      setAuth(true);
      localStorage.setItem('user', JSON.stringify(validatedUser));
    } catch (err) {
      setAuth(false);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logoutUser = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/users/logout',
        {},
        { withCredentials: true }
      );
      setAuth(false);
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, user, setUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
