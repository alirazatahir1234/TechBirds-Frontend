import { articleAPI } from '../services/api.js';

// Test backend connection
export const testBackendConnection = async () => {
  const results = {
    connection: false,
    endpoints: {},
    errors: [],
    suggestions: []
  };

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  console.log('🔄 Testing backend connection...');
  console.log('🌐 API URL:', apiUrl);

  try {
    // Test basic health check first
    try {
      const healthResponse = await fetch(`${apiUrl.replace('/api', '')}/health`, {
        method: 'GET',
        mode: 'cors'
      });
      if (healthResponse.ok) {
        results.endpoints.health = true;
        console.log('✅ Health endpoint working');
      }
    } catch (error) {
      console.log('ℹ️  Health endpoint not available (optional)');
    }

    // Test articles endpoint
    try {
      const response = await articleAPI.getArticles(1, 5);
      results.endpoints.articles = true;
      results.connection = true;
      console.log('✅ Articles endpoint working');
    } catch (error) {
      results.endpoints.articles = false;
      if (error.code === 'ERR_NETWORK') {
        results.errors.push('❌ Backend server not running');
        results.suggestions.push('Start your .NET backend: dotnet run');
        results.suggestions.push('Check if backend is running on correct port');
      } else if (error.response?.status === 404) {
        results.errors.push('❌ Articles endpoint not found');
        results.suggestions.push('Create ArticlesController in your backend');
      } else if (error.message.includes('CORS')) {
        results.errors.push('❌ CORS policy blocking requests');
        results.suggestions.push('Add CORS configuration to your .NET backend');
      } else {
        results.errors.push(`❌ Articles endpoint failed: ${error.message}`);
      }
    }

    // Test categories endpoint
    try {
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'GET',
        mode: 'cors'
      });
      if (response.ok) {
        results.endpoints.categories = true;
        console.log('✅ Categories endpoint working');
      } else {
        results.endpoints.categories = false;
        results.errors.push(`❌ Categories endpoint returned: ${response.status}`);
      }
    } catch (error) {
      results.endpoints.categories = false;
      if (!results.errors.some(err => err.includes('Backend server not running'))) {
        results.errors.push(`❌ Categories endpoint failed: ${error.message}`);
      }
    }

  } catch (error) {
    results.errors.push(`❌ General connection error: ${error.message}`);
  }

  return results;
};

// Display connection status in console
export const displayConnectionStatus = async () => {
  console.log('%c🚀 TechBirds Backend Connection Test', 'color: #30d158; font-size: 16px; font-weight: bold;');
  console.log('🌐 Backend URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('📍 Frontend URL:', window.location.origin);
  
  const results = await testBackendConnection();
  
  if (results.connection) {
    console.log('%c🎉 Backend Connected Successfully!', 'color: #30d158; font-size: 14px; font-weight: bold;');
    console.log('✅ Working endpoints:', Object.keys(results.endpoints).filter(key => results.endpoints[key]));
  } else {
    console.log('%c⚠️ Backend Connection Issues', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
    
    if (results.errors.length > 0) {
      console.log('🔍 Issues found:');
      results.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (results.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      results.suggestions.forEach(suggestion => console.log(`  ${suggestion}`));
    }
    
    console.log('\n📖 Full setup guide: BACKEND-SETUP-GUIDE.md');
    console.log('🚀 Quick start: ./start-fullstack.sh');
  }
  
  return results;
};
