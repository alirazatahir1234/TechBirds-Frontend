// Test with temporarily disabled auth
async function testWithoutAuth() {
  console.log('🧪 Testing without authentication (if backend auth is disabled)...');
  
  const testData = {
    firstName: "Test",
    lastName: "Author", 
    email: `test${Date.now()}@techbirds.com`,
    bio: "Test biography",
    specialization: "Web Development",
    status: "Active"
  };
  
  console.log('📤 Sending data:', testData);
  
  try {
    const response = await fetch('/api/admin/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📊 Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Author created without auth:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Validation error:', errorData);
      
      if (errorData.errors) {
        console.log('🔍 Field validation errors:');
        for (const [field, messages] of Object.entries(errorData.errors)) {
          console.log(`  • ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

window.testWithoutAuth = testWithoutAuth;
console.log('Run testWithoutAuth() to test without authentication');

// Also auto-run
testWithoutAuth();
