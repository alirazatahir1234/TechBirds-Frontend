// Backend Connection Test Script
// Copy and paste this into your browser console to test the connection

console.log('🔍 Testing TechBirds Backend Connection...');

// Test 1: Health Check
const testConnection = async () => {
  try {
    console.log('📡 Testing health endpoint...');
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health:', healthData);
    
    // Test 2: Admin Endpoints (requires authentication)
    console.log('🔐 Testing admin endpoints...');
    const authorsResponse = await fetch('/api/admin/authors');
    
    if (authorsResponse.status === 401) {
      console.log('🔒 Admin endpoints require authentication (expected)');
    } else {
      const authorsData = await authorsResponse.json();
      console.log('✅ Authors endpoint:', authorsData);
    }
    
    console.log('🎉 Backend connection is working properly!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
};

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('🚀 You can now use the admin panel to create users!');
  } else {
    console.log('💡 Try refreshing the page or check the console for errors');
  }
});

// Additional helper functions
window.testBackend = testConnection;
window.checkAuth = () => {
  const token = localStorage.getItem('admin_token');
  console.log('Admin token:', token ? '✅ Present' : '❌ Missing');
  return !!token;
};

console.log('💡 You can run these commands:');
console.log('- testBackend() - Test backend connection');
console.log('- checkAuth() - Check authentication status');
