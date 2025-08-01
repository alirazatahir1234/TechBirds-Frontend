// Backend Connection Test Script
// This script helps test the connection between React frontend and .NET backend

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api';

export const testBackendConnection = async () => {
  const results = {
    connection: false,
    endpoints: {},
    errors: []
  };

  console.log('🔍 Testing backend connection...');
  console.log('Backend URL:', BACKEND_URL);

  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      results.connection = true;
      results.endpoints.health = 'OK';
      console.log('✅ Backend connection successful');
    } else {
      results.endpoints.health = `Error: ${response.status}`;
      console.log('❌ Backend responded with error:', response.status);
    }
  } catch (error) {
    results.errors.push(`Connection error: ${error.message}`);
    console.log('❌ Backend connection failed:', error.message);
  }

  // Test 2: Admin endpoints
  const adminEndpoints = [
    '/admin/auth/login',
    '/admin/posts',
    '/admin/categories',
    '/admin/comments',
    '/admin/newsletter/subscribers'
  ];

  for (const endpoint of adminEndpoints) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // We expect 401 (Unauthorized) for protected endpoints without token
      if (response.status === 401) {
        results.endpoints[endpoint] = 'Protected (Expected 401)';
        console.log(`✅ ${endpoint} - Protected endpoint working`);
      } else if (response.status === 404) {
        results.endpoints[endpoint] = 'Not Found (404)';
        console.log(`❌ ${endpoint} - Endpoint not implemented`);
      } else {
        results.endpoints[endpoint] = `Status: ${response.status}`;
        console.log(`⚠️ ${endpoint} - Unexpected status: ${response.status}`);
      }
    } catch (error) {
      results.endpoints[endpoint] = `Error: ${error.message}`;
      results.errors.push(`${endpoint}: ${error.message}`);
      console.log(`❌ ${endpoint} - Error:`, error.message);
    }
  }

  return results;
};

// Test admin login functionality
export const testAdminLogin = async (credentials) => {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Login failed:', response.status, errorData);
      return { success: false, error: errorData.message || 'Login failed' };
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return { success: false, error: error.message };
  }
};

// Check if backend is running
export const checkBackendStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${BACKEND_URL}/health`, {
      signal: controller.signal,
      method: 'GET',
    });

    clearTimeout(timeoutId);
    
    return {
      isRunning: response.ok,
      status: response.status,
      url: BACKEND_URL
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        isRunning: false,
        error: 'Backend connection timeout (5s)',
        url: BACKEND_URL
      };
    }
    
    return {
      isRunning: false,
      error: error.message,
      url: BACKEND_URL
    };
  }
};

// Generate backend setup commands
export const getBackendSetupCommands = () => {
  return {
    dotnet: [
      'cd /path/to/TechBirdsWebapi',
      'dotnet restore',
      'dotnet ef database update', // If using Entity Framework
      'dotnet run'
    ],
    urls: {
      backend: 'https://localhost:7001',
      frontend: 'http://localhost:5174',
      swagger: 'https://localhost:7001/swagger'
    },
    environment: {
      ASPNETCORE_ENVIRONMENT: 'Development',
      ASPNETCORE_URLS: 'https://localhost:7001;http://localhost:7000'
    }
  };
};

// Auto-run connection test when imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log('🚀 TechBirds Backend Connection Tester loaded');
  console.log('Use testBackendConnection() to test your backend');
  console.log('Use checkBackendStatus() to check if backend is running');
  console.log('Use testAdminLogin({email, password}) to test authentication');
}
