// CORS Configuration for .NET 9 Backend
// Add this to your .NET backend Program.cs or Startup.cs

/*
// In your .NET 9 backend Program.cs, add this CORS configuration:

builder.Services.AddCors(options =>
{
    options.AddPolicy("TechBirdsFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative dev port
            "https://your-frontend-domain.com" // Production domain
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Before app.Run(), add:
app.UseCors("TechBirdsFrontend");
*/

// Expected API Endpoints Structure for TechBirds:
export const expectedEndpoints = {
  // Articles
  'GET /api/articles': 'Get paginated articles',
  'GET /api/articles/{id}': 'Get article by ID',
  'GET /api/articles/featured': 'Get featured articles',
  'GET /api/articles/trending': 'Get trending articles',
  'GET /api/articles/popular': 'Get popular articles',
  
  // Categories
  'GET /api/categories': 'Get all categories',
  'GET /api/categories/{id}/articles': 'Get articles by category',
  
  // Authors
  'GET /api/authors': 'Get all authors',
  'GET /api/authors/{id}': 'Get author by ID',
  'GET /api/authors/{id}/articles': 'Get articles by author',
  
  // Search
  'GET /api/search': 'Search articles',
  
  // Newsletter
  'POST /api/newsletter/subscribe': 'Subscribe to newsletter',
  
  // Comments (optional)
  'GET /api/articles/{id}/comments': 'Get article comments',
  'POST /api/articles/{id}/comments': 'Add comment',
  
  // Stats (optional)
  'GET /api/stats/dashboard': 'Get dashboard statistics'
};
