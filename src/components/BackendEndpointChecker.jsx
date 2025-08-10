import React, { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

function BackendEndpointChecker() {
  const { token } = useAdminAuth();
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const checkEndpoints = async () => {
    setLoading(true);
    setResults('🔍 Checking backend endpoints...\n\n');
    
    const endpoints = [
      { method: 'GET', url: '/api/health', description: 'Health Check' },
      { method: 'GET', url: '/api/admin/authors', description: 'Get Users', requiresAuth: true },
      { method: 'POST', url: '/api/admin/authors', description: 'Create User', requiresAuth: true },
      { method: 'GET', url: '/api/authors', description: 'Public Users' },
      { method: 'GET', url: '/api/admin/dashboard/stats', description: 'Dashboard Stats', requiresAuth: true },
      { method: 'GET', url: '/api/admin/posts', description: 'Admin Posts', requiresAuth: true }
    ];

    for (const endpoint of endpoints) {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (endpoint.requiresAuth && token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
          method: endpoint.method,
          headers
        };

        // For POST requests, add minimal test data
        if (endpoint.method === 'POST' && endpoint.url.includes('authors')) {
          options.body = JSON.stringify({
            firstName: "Test",
            lastName: "User",
            email: `test${Date.now()}@example.com`,
            password: "testpass123",
            status: "Active",
            role: "Author"
          });
        }

        const response = await fetch(endpoint.url, options);
        
        let statusIcon = '✅';
        if (response.status >= 400) {
          statusIcon = response.status === 404 ? '🚫' : '❌';
        }
        
        const responseText = await response.text();
        let responseData = responseText;
        
        try {
          const parsed = JSON.parse(responseText);
          responseData = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // Keep as text if not JSON
        }
        
        setResults(prev => prev + 
          `${statusIcon} ${endpoint.method} ${endpoint.url}\n` +
          `   Status: ${response.status} ${response.statusText}\n` +
          `   Auth Required: ${endpoint.requiresAuth ? 'Yes' : 'No'}\n` +
          `   Response Preview: ${responseData.substring(0, 100)}${responseData.length > 100 ? '...' : ''}\n\n`
        );
        
      } catch (error) {
        setResults(prev => prev + 
          `❌ ${endpoint.method} ${endpoint.url}\n` +
          `   Error: ${error.message}\n\n`
        );
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setResults(prev => prev + '\n🎯 Summary:\n');
    setResults(prev => prev + '• ✅ = Working endpoint\n');
    setResults(prev => prev + '• 🚫 = Not implemented (404)\n');
    setResults(prev => prev + '• ❌ = Error or unauthorized\n\n');
    setResults(prev => prev + '📋 Next Steps:\n');
    setResults(prev => prev + '1. Implement missing endpoints (🚫) in your backend\n');
    setResults(prev => prev + '2. Fix authentication issues (❌) if any\n');
    setResults(prev => prev + '3. Follow the BACKEND-IMPLEMENTATION-GUIDE.md\n');
    
    setLoading(false);
  };

  return (
    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold mb-3 text-blue-900">🔧 Backend Endpoint Checker</h3>
      
      <div className="space-y-3">
        <button
          onClick={checkEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔍 Checking Endpoints...' : '🚀 Check All Endpoints'}
        </button>
        
        {results && (
          <div className="bg-black text-green-400 p-3 rounded font-mono text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
            {results}
          </div>
        )}
        
        <div className="text-xs text-blue-700">
          This tool checks which backend endpoints are implemented and working.
          Use this to identify what needs to be added to your .NET backend.
        </div>
      </div>
    </div>
  );
}

export default BackendEndpointChecker;
