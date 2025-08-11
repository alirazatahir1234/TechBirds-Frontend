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
  'GET /api/posts': 'Get paginated posts/articles',
  'GET /api/posts/{id}': 'Get post/article by ID',
  'GET /api/posts/featured': 'Get featured posts/articles',
  'GET /api/posts?search={query}': 'Search posts/articles',
  'GET /api/posts?categoryId={id}': 'Get posts/articles by category',
  
  // Categories
  'GET /api/categories': 'Get all categories',
  'GET /api/categories/{id}/posts': 'Get posts by category',
  
  // Authors
  'GET /api/authors': 'Get all authors',
  'GET /api/authors/{id}': 'Get author by ID',
  'GET /api/authors/{id}/posts': 'Get posts by author',
  
  // Search
  'GET /api/search': 'Search articles',
  
  // Newsletter
  'POST /api/newsletter/subscribe': 'Subscribe to newsletter',
  
  // Comments (optional)
  'GET /api/posts/{id}/comments': 'Get post comments',
  'POST /api/posts/{id}/comments': 'Add comment',
  
  // Stats (optional)
  'GET /api/stats/dashboard': 'Get dashboard statistics'
};
