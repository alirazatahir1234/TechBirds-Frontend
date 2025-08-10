// Quick authentication check for admin panel
const checkAuthAndAPI = async () => {
  console.log('🔐 Checking Authentication & API Status...\n');
  
  // Check if admin token exists
  const adminToken = localStorage.getItem('admin_token');
  const authToken = localStorage.getItem('authToken');
  
  console.log('Admin Token:', adminToken ? 'Present' : 'Missing');
  console.log('Auth Token:', authToken ? 'Present' : 'Missing');
  
  if (!adminToken && !authToken) {
    console.log('❌ No authentication tokens found');
    console.log('💡 You need to log in as an admin first');
    return;
  }
  
  // Test API endpoint with authentication
  try {
    const response = await fetch('/api/admin/authors', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken || authToken}`,
        'Accept': 'application/json'
      }
    });
    
    console.log(`\n📡 GET /api/admin/authors: ${response.status} ${response.statusText}`);
    
    if (response.status === 401 || response.status === 403) {
      console.log('❌ Authentication failed - invalid or expired token');
      console.log('💡 Please log in again');
      return;
    }
    
    if (response.status === 404) {
      console.log('❌ Endpoint not found - backend may not have admin authors controller');
      console.log('💡 Check if backend has AdminAuthorsController implemented');
      return;
    }
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint working!');
      console.log('📊 Response type:', typeof data);
      console.log('📋 Response structure:', Object.keys(data || {}));
      
      // Now test POST with minimal data
      console.log('\n🧪 Testing POST with minimal valid data...');
      
      const testAuthor = {
        firstName: "Test", 
        lastName: "Author",
        email: `test${Date.now()}@techbirds.com`,
        status: "Active" // Try with proper case
      };
      
      const postResponse = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken || authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testAuthor)
      });
      
      console.log(`📤 POST result: ${postResponse.status} ${postResponse.statusText}`);
      
      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        console.log('❌ POST Error:', errorText);
        
        if (postResponse.status === 400) {
          console.log('\n🔍 400 Bad Request - Likely causes:');
          console.log('1. Backend Author model missing required fields');
          console.log('2. Database not updated with new schema');
          console.log('3. Validation rules not matching frontend data');
          console.log('4. Status enum case sensitivity issue');
        }
      } else {
        const result = await postResponse.json();
        console.log('✅ POST Success!', result);
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Unexpected error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Check if backend is running and proxy is working');
  }
};

// Auto-run the check
checkAuthAndAPI();

// Make it available in console
if (typeof window !== 'undefined') {
  window.checkAuthAndAPI = checkAuthAndAPI;
}
