import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('token');
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setToken(null);
        sessionStorage.removeItem('token');
      }
    } catch (e) {
      console.error("Auth initialization error:", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
      fetchUser();
    } else {
      sessionStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (credentials, role) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role })
      });
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Server returned invalid response');
      }

      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setToken(data.token);
      setUser(data.user);
      sessionStorage.setItem('token', data.token);
      toast.success('Logged in successfully!');
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  };

  const register = async (studentData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Server returned invalid response');
      }

      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      toast.success('Registration successful! Please log in.');
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    toast.success('Logged out');
  };

  const value = { 
    user, 
    token, 
    loading, 
    login, 
    register, 
    logout, 
    refreshUser: fetchUser 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
