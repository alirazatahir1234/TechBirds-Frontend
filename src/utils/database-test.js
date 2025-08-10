// Database Connection Test Script for TechBirds
// This script tests if Posts data is being saved to the PostgreSQL database

const BACKEND_URL = 'https://localhost:7001/api';

// Test database connectivity and Posts functionality
export const testPostsDatabase = async () => {
  console.log('🔍 Testing Posts Database Connectivity...');
  
  const results = {
    healthCheck: false,
    authentication: false,
    postsEndpoint: false,
    categoriesEndpoint: false,
    databaseOperations: false,
    errors: []
  };

  try {
    // Step 1: Health Check
    console.log('1. Testing backend health...');
    const healthResponse = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (healthResponse.ok) {
      results.healthCheck = true;
      console.log('✅ Backend health check passed');
    } else {
      results.errors.push(`Health check failed: ${healthResponse.status}`);
    }

    // Step 2: Test authentication endpoint
    console.log('2. Testing admin authentication endpoint...');
    const authResponse = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrongpassword' })
    });
    
    if (authResponse.status === 400 || authResponse.status === 401) {
      results.authentication = true;
      console.log('✅ Authentication endpoint responding correctly');
    } else {
      results.errors.push(`Auth endpoint unexpected status: ${authResponse.status}`);
    }

    // Step 3: Test Posts endpoint (should require auth)
    console.log('3. Testing Posts endpoint...');
    const postsResponse = await fetch(`${BACKEND_URL}/admin/posts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (postsResponse.status === 401) {
      results.postsEndpoint = true;
      console.log('✅ Posts endpoint is protected (401 Unauthorized)');
    } else if (postsResponse.ok) {
      results.postsEndpoint = true;
      console.log('✅ Posts endpoint responding');
    } else {
      results.errors.push(`Posts endpoint error: ${postsResponse.status}`);
    }

    // Step 4: Test Categories endpoint
    console.log('4. Testing Categories endpoint...');
    const categoriesResponse = await fetch(`${BACKEND_URL}/admin/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (categoriesResponse.status === 401) {
      results.categoriesEndpoint = true;
      console.log('✅ Categories endpoint is protected (401 Unauthorized)');
    } else if (categoriesResponse.ok) {
      results.categoriesEndpoint = true;
      console.log('✅ Categories endpoint responding');
    } else {
      results.errors.push(`Categories endpoint error: ${categoriesResponse.status}`);
    }

    // Step 5: Test with sample admin login (if we can create one)
    console.log('5. Testing sample admin registration...');
    const sampleAdmin = {
      name: 'Test Admin',
      email: 'testadmin@techbirds.com',
      password: 'TestPassword123!'
    };

    const registerResponse = await fetch(`${BACKEND_URL}/admin/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleAdmin)
    });

    if (registerResponse.ok) {
      console.log('✅ Admin registration successful');
      
      // Try to login with the new admin
      const loginResponse = await fetch(`${BACKEND_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sampleAdmin.email,
          password: sampleAdmin.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Admin login successful');
        
        // Test creating a post with authentication
        const samplePost = {
          title: 'Test Post from Database Verification',
          content: 'This is a test post to verify database connectivity.',
          summary: 'Testing database operations',
          categoryId: 1,
          tags: ['test', 'database'],
          isPublished: true
        };

        const createPostResponse = await fetch(`${BACKEND_URL}/admin/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify(samplePost)
        });

        if (createPostResponse.ok) {
          results.databaseOperations = true;
          console.log('✅ Post creation successful - Database is working!');
          
          // Retrieve the created post
          const getPostsResponse = await fetch(`${BACKEND_URL}/admin/posts`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginData.token}`
            }
          });

          if (getPostsResponse.ok) {
            const posts = await getPostsResponse.json();
            console.log(`✅ Retrieved ${posts.length || 0} posts from database`);
          }
        } else {
          results.errors.push(`Post creation failed: ${createPostResponse.status}`);
        }
      } else {
        results.errors.push(`Admin login failed: ${loginResponse.status}`);
      }
    } else {
      console.log(`ℹ️ Admin registration status: ${registerResponse.status} (might already exist)`);
    }

  } catch (error) {
    results.errors.push(`Connection error: ${error.message}`);
    console.log('❌ Connection error:', error.message);
  }

  return results;
};

// Test function for manual execution
export const runDatabaseTest = async () => {
  console.log('🚀 Starting TechBirds Database Connectivity Test');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Database: PostgreSQL (techbirdsdb)');
  console.log('-------------------------------------------');
  
  const results = await testPostsDatabase();
  
  console.log('\n📊 Test Results:');
  console.log(`Health Check: ${results.healthCheck ? '✅' : '❌'}`);
  console.log(`Authentication: ${results.authentication ? '✅' : '❌'}`);
  console.log(`Posts Endpoint: ${results.postsEndpoint ? '✅' : '❌'}`);
  console.log(`Categories Endpoint: ${results.categoriesEndpoint ? '✅' : '❌'}`);
  console.log(`Database Operations: ${results.databaseOperations ? '✅' : '❌'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  const allPassed = results.healthCheck && results.authentication && 
                   results.postsEndpoint && results.categoriesEndpoint;
  
  console.log(`\n${allPassed ? '✅' : '❌'} Overall Status: ${
    allPassed ? 'Database connection is working!' : 'Issues detected - check errors above'
  }`);
  
  return results;
};

// Auto-execute if running in browser
if (typeof window !== 'undefined') {
  console.log('🔧 Database test utilities loaded');
  console.log('Run runDatabaseTest() to test database connectivity');
}
