// Minimal test to find exact validation issue
async function testMinimalAuthor() {
  console.log('🧪 Testing minimal author data to isolate validation issue...\n');
  
  // Get authentication token
  const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  console.log('🔐 Using token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log('❌ No authentication token found. Please log in first.');
    return;
  }
  
  // Test with absolute minimal data
  const minimalData = {
    firstName: "Test",
    lastName: "Author",
    email: "test@techbirds.com"
  };
  
  console.log('📤 Testing with minimal data:', JSON.stringify(minimalData, null, 2));
  
  try {
    const response = await fetch('/api/admin/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log(`📊 Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Minimal data works:', data);
      return true;
    } else {
      const errorData = await response.json();
      console.log('❌ Validation failed with minimal data:');
      console.log('Error details:', errorData);
      
      if (errorData.errors) {
        console.log('\n🔍 Specific validation errors:');
        for (const [field, messages] of Object.entries(errorData.errors)) {
          const messageList = Array.isArray(messages) ? messages : [messages];
          console.log(`  • ${field}: ${messageList.join(', ')}`);
        }
        
        // Suggest fixes based on common validation errors
        console.log('\n💡 Suggested fixes:');
        for (const [field, messages] of Object.entries(errorData.errors)) {
          const messageList = Array.isArray(messages) ? messages : [messages];
          const message = messageList.join(' ').toLowerCase();
          
          if (message.includes('required')) {
            console.log(`  • Add ${field} to the request data`);
          }
          if (message.includes('email')) {
            console.log(`  • Fix email format for ${field}`);
          }
          if (message.includes('length')) {
            console.log(`  • Check string length for ${field}`);
          }
          if (field.toLowerCase().includes('status')) {
            console.log(`  • Try status values: "Active", "Inactive", or "Suspended"`);
          }
        }
      }
      
      return false;
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Test with gradually more fields if minimal works
async function testGradualFields() {
  const minimal = await testMinimalAuthor();
  
  if (!minimal) {
    console.log('\n❌ Minimal test failed. Fix basic validation first.');
    return;
  }
  
  console.log('\n🧪 Minimal test passed! Testing with additional fields...\n');
  
  const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  
  const testCases = [
    {
      name: "With status",
      data: {
        firstName: "Test",
        lastName: "Author", 
        email: "test2@techbirds.com",
        status: "Active"
      }
    },
    {
      name: "With bio",
      data: {
        firstName: "Test",
        lastName: "Author",
        email: "test3@techbirds.com", 
        status: "Active",
        bio: "Test bio"
      }
    },
    {
      name: "With specialization",
      data: {
        firstName: "Test",
        lastName: "Author",
        email: "test4@techbirds.com",
        status: "Active", 
        bio: "Test bio",
        specialization: "Web Development"
      }
    },
    {
      name: "Full data (like frontend sends)",
      data: {
        firstName: "Test",
        lastName: "Author",
        email: "test5@techbirds.com",
        bio: "Full test bio",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        website: "https://test.com",
        twitter: "https://twitter.com/test",
        linkedin: "https://linkedin.com/in/test", 
        specialization: "Web Development",
        status: "Active"
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testCase.data)
      });
      
      if (response.ok) {
        console.log(`✅ ${testCase.name}: SUCCESS`);
      } else {
        const errorData = await response.json();
        console.log(`❌ ${testCase.name}: FAILED (${response.status})`);
        
        if (errorData.errors) {
          for (const [field, messages] of Object.entries(errorData.errors)) {
            console.log(`  • ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
          }
        }
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name}: Network error - ${error.message}`);
    }
  }
}

// Make functions available globally
window.testMinimalAuthor = testMinimalAuthor;
window.testGradualFields = testGradualFields;

console.log('🚀 Run testMinimalAuthor() or testGradualFields() in the console');
