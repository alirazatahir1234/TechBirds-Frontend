# 🔗 TechBirds Frontend-Backend Connection Guide

## 📋 Prerequisites
1. ✅ Frontend running on http://localhost:5173
2. 🔄 .NET 9 Backend needs to be running

## 🚀 Quick Setup Steps

### 1. Configure Your Backend URL
Update `.env.local` with your actual backend URL:
```env
VITE_API_BASE_URL=https://localhost:7001/api
```

### 2. Add CORS to Your .NET 9 Backend
Add this to your `Program.cs`:

```csharp
// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("TechBirdsFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative port
            "https://your-domain.com" // Production
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Use CORS (add before app.Run())
app.UseCors("TechBirdsFrontend");
```

### 3. Required API Endpoints
Your .NET backend should have these endpoints:

#### Articles
- `GET /api/articles` - Get paginated articles
- `GET /api/articles/{id}` - Get article by ID  
- `GET /api/articles/featured` - Get featured articles
- `GET /api/articles/trending` - Get trending articles

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}/articles` - Get articles by category

#### Authors  
- `GET /api/authors` - Get all authors
- `GET /api/authors/{id}` - Get author by ID
- `GET /api/authors/{id}/articles` - Get author articles

#### Search
- `GET /api/search?q={query}` - Search articles

#### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

## 🧪 Testing Connection

1. **Start your .NET backend** (ensure it's running on the configured port)
2. **Open browser console** and visit http://localhost:5173
3. **Check console logs** for connection status:
   - ✅ "Backend connected successfully!" = Working
   - ❌ "Backend connection issues" = Check backend

## 🔧 Troubleshooting

### Backend Not Running
```
❌ Backend connection failed: Network Error
```
**Solution**: Start your .NET 9 backend server

### Wrong Port/URL
```
❌ Articles endpoint failed: Request failed with status code 404
```
**Solution**: Update `VITE_API_BASE_URL` in `.env.local`

### CORS Issues
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Add CORS configuration to your .NET backend

### SSL Certificate Issues
```
❌ SSL certificate problem
```
**Solution**: For development, use HTTP instead of HTTPS in your backend URL

## 📝 Example Backend Response Format

Your .NET API should return JSON in this format:

### Articles Response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Article content...",
      "excerpt": "Short description",
      "slug": "article-title",
      "imageUrl": "https://example.com/image.jpg",
      "publishedAt": "2025-01-01T00:00:00Z",
      "category": {
        "id": 1,
        "name": "Technology",
        "slug": "technology"
      },
      "author": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 10
}
```

## 🎯 Next Steps

1. **Start your .NET 9 backend**
2. **Update the API URL** in `.env.local`
3. **Add CORS configuration** to your backend
4. **Test the connection** by visiting http://localhost:5173
5. **Check browser console** for connection status
6. **Implement the required API endpoints** in your backend

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your backend is running and accessible
3. Ensure CORS is properly configured
4. Verify the API endpoints match the expected format

Happy coding! 🚀
