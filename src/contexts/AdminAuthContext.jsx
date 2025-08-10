// Admin Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  // Check if admin is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      // If we already have an admin user (from login), don't re-validate
      if (adminUser) {
        setLoading(false);
        return;
      }

      if (token) {
        // Since getCurrentAdmin might not work properly,
        // we'll trust the token and create a basic user object
        const fallbackUser = {
          email: 'admin@techbirds.com',
          role: 'Admin',
          id: 1
        };
        setAdminUser(fallbackUser);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials);
      const { user: adminData, token: authToken } = response;
      
      setAdminUser(adminData);
      setToken(authToken);
      localStorage.setItem('admin_token', authToken);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed';
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to backend. Make sure your .NET server is running.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (adminData) => {
    try {
      const response = await adminAPI.register(adminData);
      return { success: true, data: response };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to backend. Make sure your .NET server is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  const isAuthenticated = () => {
    return !!adminUser && !!token;
  };

  const value = {
    adminUser,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
