// Comprehensive validation test - runs automatically when auth is disabled
console.log('🧪 Comprehensive Author Validation Test');
console.log('========================================');

async function runValidationTests() {
  console.log('🔍 Testing different data combinations to find validation requirements...\n');
  
  const testCases = [
    {
      name: "Absolutely Minimal",
      data: {
        firstName: "Test",
        lastName: "Author"
      }
    },
    {
      name: "With Email",
      data: {
        firstName: "Test",
        lastName: "Author",
        email: "test@example.com"
      }
    },
    {
      name: "With Status (lowercase)",
      data: {
        firstName: "Test",
        lastName: "Author", 
        email: "test1@example.com",
        status: "active"
      }
    },
    {
      name: "With Status (proper case)",
      data: {
        firstName: "Test",
        lastName: "Author",
        email: "test2@example.com", 
        status: "Active"
      }
    },
    {
      name: "Frontend Full Data",
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        bio: "Test biography for author",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        website: "https://johndoe.com",
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        specialization: "Web Development",
        status: "Active"
      }
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. 📋 Testing: ${testCase.name}`);
    console.log('   Data:', JSON.stringify(testCase.data, null, 4));
    
    try {
      const response = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // No auth header since we disabled it
        },
        body: JSON.stringify(testCase.data)
      });
      
      console.log(`   📊 Response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ SUCCESS! This data structure works:`, data);
        console.log('\n🎉 SOLUTION FOUND! Use this data structure in your frontend.');
        break; // Stop on first success
        
      } else if (response.status === 401) {
        console.log('   🔐 Still getting 401 - auth not fully disabled yet');
        console.log('   💡 Make sure you restarted the backend after commenting out [Authorize]');
        break;
        
      } else {
        const errorData = await response.json();
        console.log(`   ❌ Failed: ${response.status}`);
        
        if (errorData.errors) {
          console.log('   🔍 Validation errors:');
          for (const [field, messages] of Object.entries(errorData.errors)) {
            const msgList = Array.isArray(messages) ? messages : [messages];
            console.log(`     • ${field}: ${msgList.join(', ')}`);
          }
        }
        
        if (errorData.title) {
          console.log(`   📝 Error: ${errorData.title}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Network error: ${error.message}`);
      if (error.message.includes('ERR_CONNECTION_REFUSED')) {
        console.log('   💡 Backend appears to be down. Is it running?');
        break;
      }
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('If you see validation errors above, those tell you exactly what fields are required.');
  console.log('If you see 401 errors, the auth is not fully disabled yet.');
  console.log('If you see SUCCESS, that data structure works!');
}

// Auto-run test
runValidationTests();

// Make available globally
window.runValidationTests = runValidationTests;

console.log('\n🚀 This test will run automatically.');
console.log('🔄 Run runValidationTests() again if needed.');
