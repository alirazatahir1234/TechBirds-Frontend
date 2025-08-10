import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';

function DebugPanel() {
  const { adminUser, token } = useAdminAuth();
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing backend connection...\n');
    
    try {
      // Test basic health endpoint
      const response = await fetch('/api/health');
      const health = await response.json();
      setTestResult(prev => prev + `✅ Health check: ${health.status}\n`);
      
      // Test admin authentication
      setTestResult(prev => prev + `🔑 Admin user: ${adminUser ? adminUser.email : 'Not logged in'}\n`);
      setTestResult(prev => prev + `🎫 Token available: ${token ? 'Yes' : 'No'}\n`);
      
      // Test authors endpoint
      const authors = await adminAPI.getAuthors();
      setTestResult(prev => prev + `👥 Authors loaded: ${Array.isArray(authors) ? authors.length : 'Error'}\n`);
      
      // Test create user with minimal data
      const testUser = {
        firstName: "Test",
        lastName: "User",
        email: `test${Date.now()}@example.com`,
        password: "testpass123",
        status: "Active",
        role: "Author"
      };
      
      setTestResult(prev => prev + '📝 Testing user creation...\n');
      const created = await adminAPI.createAuthor(testUser);
      setTestResult(prev => prev + `✅ User created: ${created.id}\n`);

      // Clean up - delete test user
      await adminAPI.deleteAuthor(created.id);
      setTestResult(prev => prev + '🗑️ Test user deleted\n');
      setTestResult(prev => prev + '✅ All tests passed!\n');
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult(prev => prev + `❌ Error: ${error.message}\n`);
      if (error.response) {
        setTestResult(prev => prev + `📊 Status: ${error.response.status}\n`);
        setTestResult(prev => prev + `📋 Data: ${JSON.stringify(error.response.data, null, 2)}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">🔧 Debug Panel</h3>
      
      <div className="space-y-3">
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        {testResult && (
          <div className="bg-black text-green-400 p-3 rounded font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}

export default DebugPanel;
