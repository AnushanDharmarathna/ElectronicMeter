import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const API = 'http://localhost:5000/api';

  // Load stored data (id, username, role)
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null; // { id, username, role }
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);

  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------------------
     Verify token on first load
  -------------------------------------------------------------- */
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return navigate('/home', { replace: true });
      }

      try {
        const res = await fetch(`${API}/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          sessionStorage.clear();
          setToken(null);
          setUser(null);
          return navigate('/home', { replace: true });
        }

        if (location.pathname === '/' || location.pathname === '/home') {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        sessionStorage.clear();
        setToken(null);
        setUser(null);
        navigate('/home', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  /* --------------------------------------------------------------
     Login
  -------------------------------------------------------------- */
  const login = async (username, password) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Extract id, username, role from backend response
    const userObject = {
      id: data.user.id,
      username: data.user.username,
      role: data.user.role,
      company: data.user.company,
      branch: data.user.branch
    };

    // Save to sessionStorage
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(userObject));

    // Save to React state
    setToken(data.token);
    setUser(userObject);

    navigate('/dashboard', { replace: true });
  };

  /* --------------------------------------------------------------
     Logout
  -------------------------------------------------------------- */
  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    navigate('/home', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
