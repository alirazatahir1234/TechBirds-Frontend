// Admin Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { checkBackendStatus } from '../utils/backend-connection-test';

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
  const [backendStatus, setBackendStatus] = useState(null);

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      const status = await checkBackendStatus();
      setBackendStatus(status);
      
      if (!status.isRunning) {
        console.warn('🔥 Backend is not running:', status.error);
        console.log('💡 Make sure your .NET backend is running on:', status.url);
      }
    };
    
    checkBackend();
  }, []);

  // Check if admin is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const adminData = await adminAPI.getCurrentAdmin();
          setAdminUser(adminData);
        } catch (error) {
          console.error('Admin auth check failed:', error);
          // Don't logout if it's just a backend connection issue
          if (error.code !== 'NETWORK_ERROR' && error.code !== 'ERR_NETWORK') {
            logout();
          }
        }
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
    backendStatus,
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
