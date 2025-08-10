// Emergency minimal author creator - bypasses most validation
async function createMinimalAuthor() {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  
  if (!token) {
    console.log('❌ Please log in first');
    return;
  }
  
  const minimalAuthor = {
    firstName: "Emergency",
    lastName: "Test",
    email: `test${Date.now()}@techbirds.com` // Unique email
  };
  
  try {
    const response = await fetch('/api/admin/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(minimalAuthor)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Minimal author created successfully!', data);
      return data;
    } else {
      const error = await response.json();
      console.log('❌ Still failing:', error);
      
      if (error.errors) {
        console.log('Required fields according to backend:');
        Object.keys(error.errors).forEach(field => {
          console.log(`- ${field}`);
        });
      }
    }
  } catch (err) {
    console.log('Network error:', err.message);
  }
}

window.createMinimalAuthor = createMinimalAuthor;
console.log('Run createMinimalAuthor() to test minimal author creation');
