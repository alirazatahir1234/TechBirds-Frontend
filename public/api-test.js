// Simple test to check if the backend API structure matches our frontend expectations
console.log('🔧 Backend API Structure Test');

// Get real token from localStorage
function getAuthToken() {
  return localStorage.getItem('admin_token') || localStorage.getItem('authToken') || 'dummy-token';
}

// Function to test different status values
async function testStatusValues() {
  const testData = {
    firstName: "Test",
    lastName: "User", 
    email: "test@example.com",
    bio: "Test bio",
    specialization: "Web Development"
  };

  const statusValues = ["active", "Active", "ACTIVE", 1, "inactive", "suspended"];
  
  console.log('Testing different status values that might be causing 400 errors:');
  
  for (const status of statusValues) {
    console.log(`\n📋 Testing status: "${status}" (type: ${typeof status})`);
    
    const payload = { ...testData, status };
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log(`✅ Status ${status}: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`❌ Error response:`, errorData);
        
        // Show detailed validation errors
        if (errorData.errors) {
          console.log('🔍 Validation errors:');
          for (const [field, messages] of Object.entries(errorData.errors)) {
            console.log(`  ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
          }
        }
      } else {
        const data = await response.json();
        console.log(`📦 Success data:`, data);
        break; // Stop on first success
      }
      
    } catch (error) {
      console.log(`❌ Network error:`, error.message);
    }
  }
}

// Function to test required fields
async function testRequiredFields() {
  console.log('\n\n🧪 Testing Required Fields Validation:');
  
  const testCases = [
    {
      name: "All fields",
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        bio: "Bio",
        specialization: "Tech",
        status: "active"
      }
    },
    {
      name: "Missing firstName",
      data: {
        lastName: "Doe",
        email: "john@example.com",
        status: "active"
      }
    },
    {
      name: "Missing email", 
      data: {
        firstName: "John",
        lastName: "Doe",
        status: "active"
      }
    },
    {
      name: "Invalid email",
      data: {
        firstName: "John",
        lastName: "Doe", 
        email: "not-an-email",
        status: "active"
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    
    try {
      const response = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(testCase.data)
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error:`, errorData);
        
        if (errorData.errors) {
          console.log('🔍 Validation errors:');
          for (const [field, messages] of Object.entries(errorData.errors)) {
            console.log(`  ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
          }
        }
      }
      
    } catch (error) {
      console.log(`Network error:`, error.message);
    }
  }
}

// Run tests when page loads
if (typeof window !== 'undefined') {
  window.testAPI = { testStatusValues, testRequiredFields };
  console.log('🚀 Run window.testAPI.testStatusValues() or window.testAPI.testRequiredFields() in console');
} else {
  testStatusValues().then(() => testRequiredFields());
}
