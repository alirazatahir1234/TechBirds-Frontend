// Admin login helper for testing
async function loginAsAdmin() {
  console.log('🔐 Attempting admin login...');
  
  // Try common admin credentials (adjust these based on your backend)
  const credentials = [
    { email: 'admin@techbirds.com', password: 'admin123' },
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'admin@admin.com', password: 'password' },
    { email: 'test@admin.com', password: '123456' }
  ];
  
  for (const cred of credentials) {
    console.log(`Trying: ${cred.email}`);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cred)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful!', data);
        
        // Store the token
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          console.log('Token stored in localStorage');
          return data.token;
        }
        
        if (data.accessToken) {
          localStorage.setItem('admin_token', data.accessToken);
          console.log('Access token stored in localStorage');
          return data.accessToken;
        }
        
      } else {
        const error = await response.json();
        console.log(`❌ ${cred.email}: ${response.status}`, error.message || error);
      }
      
    } catch (error) {
      console.log(`❌ ${cred.email}: Network error -`, error.message);
    }
  }
  
  console.log('❌ All login attempts failed');
  console.log('💡 You may need to:');
  console.log('  1. Register an admin user first');
  console.log('  2. Check your backend auth endpoints');
  console.log('  3. Use different credentials');
  
  return null;
}

// Test author creation with proper auth
async function testWithAuth() {
  console.log('🧪 Testing author creation with authentication...');
  
  // Try to get existing token first
  let token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  
  if (!token) {
    console.log('No token found, attempting login...');
    token = await loginAsAdmin();
    
    if (!token) {
      console.log('❌ Cannot test without valid authentication');
      return;
    }
  }
  
  const testAuthor = {
    firstName: "Test",
    lastName: "Author",
    email: `test${Date.now()}@techbirds.com`,
    status: "Active"
  };
  
  console.log('📤 Testing author creation with token...');
  
  try {
    const response = await fetch('/api/admin/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testAuthor)
    });
    
    console.log(`📊 Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Author created:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Failed:', errorData);
      
      if (response.status === 401) {
        console.log('🔐 Token expired or invalid. Try logging in again.');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('authToken');
      }
      
      if (errorData.errors) {
        console.log('🔍 Validation errors:');
        for (const [field, messages] of Object.entries(errorData.errors)) {
          console.log(`  • ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Make functions available globally
window.loginAsAdmin = loginAsAdmin;
window.testWithAuth = testWithAuth;

console.log('🚀 Functions available:');
console.log('  loginAsAdmin() - Try to log in with common admin credentials');
console.log('  testWithAuth() - Test author creation with authentication');

// Auto-run the test
testWithAuth();
