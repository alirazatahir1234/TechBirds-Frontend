# TechBirds Backend Integration Guide

## 🔗 **Connecting Frontend to .NET 9 Backend**

This guide will help you connect your TechBirds React frontend to your TechBirdsWebapi .NET 9 backend.

## 📋 **Prerequisites**

1. ✅ **Frontend**: TechBirds React app (already set up)
2. ✅ **Backend**: TechBirdsWebapi .NET 9 project
3. ✅ **Database**: SQL Server or PostgreSQL
4. ✅ **Development Environment**: .NET 9 SDK, Node.js

## 🛠️ **Backend API Endpoints Required**

Your .NET 9 backend should implement these endpoints:

### **Authentication Endpoints**
```csharp
// AdminController.cs
[Route("api/admin/auth")]
[ApiController]
public class AdminAuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) { }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request) { }
    
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentAdmin() { }
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout() { }
}
```

### **Posts Management Endpoints**
```csharp
// PostsController.cs
[Route("api/admin/posts")]
[ApiController]
[Authorize(Roles = "Admin")]
public class PostsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] PostQueryParams parameters) { }
    
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request) { }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostRequest request) { }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id) { }
}
```

### **Categories Management Endpoints**
```csharp
// CategoriesController.cs
[Route("api/admin/categories")]
[ApiController]
[Authorize(Roles = "Admin")]
public class CategoriesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCategories() { }
    
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request) { }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request) { }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id) { }
}
```

### **Comments Management Endpoints**
```csharp
// CommentsController.cs
[Route("api/admin/comments")]
[ApiController]
[Authorize(Roles = "Admin")]
public class CommentsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetComments([FromQuery] CommentQueryParams parameters) { }
    
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateCommentStatus(int id, [FromBody] UpdateStatusRequest request) { }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id) { }
    
    [HttpPost("{id}/reply")]
    public async Task<IActionResult> ReplyToComment(int id, [FromBody] ReplyRequest request) { }
}
```

### **Newsletter Management Endpoints**
```csharp
// NewsletterController.cs
[Route("api/admin/newsletter")]
[ApiController]
[Authorize(Roles = "Admin")]
public class NewsletterController : ControllerBase
{
    [HttpGet("subscribers")]
    public async Task<IActionResult> GetSubscribers([FromQuery] SubscriberQueryParams parameters) { }
    
    [HttpPost("campaigns")]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignRequest request) { }
    
    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaigns() { }
    
    [HttpPost("campaigns/{id}/send")]
    public async Task<IActionResult> SendCampaign(int id) { }
}
```

## 🔧 **Backend Configuration**

### **1. CORS Configuration**
```csharp
// Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Use CORS
app.UseCors("AllowFrontend");
```

### **2. JWT Authentication**
```csharp
// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

### **3. Response Models**
```csharp
// Models/AuthResponse.cs
public class AuthResponse
{
    public AdminUser User { get; set; }
    public string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
}

// Models/AdminUser.cs
public class AdminUser
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

## 🚀 **Starting Both Projects**

### **1. Start Backend (.NET 9)**
```bash
cd /path/to/TechBirdsWebapi
dotnet run
```
*Should run on: https://localhost:7001*

### **2. Start Frontend (React)**
```bash
cd /path/to/TechBirds/Frontend
npm run dev
```
*Should run on: http://localhost:5174*

## 🔍 **Testing Connection**

### **1. Check Backend Health**
```bash
curl https://localhost:7001/api/health
```

### **2. Test API Endpoints**
```bash
# Test admin login
curl -X POST https://localhost:7001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techbirds.com","password":"your_password"}'
```

### **3. Frontend Connection Test**
1. Open frontend: `http://localhost:5174`
2. Go to admin login: `http://localhost:5174/admin/login`
3. Try to login with backend credentials
4. Check browser Network tab for API calls

## 🐛 **Common Issues & Solutions**

### **Issue 1: CORS Error**
```
Access to fetch at 'https://localhost:7001/api/admin/auth/login' from origin 'http://localhost:5174' has been blocked by CORS policy
```
**Solution**: Configure CORS in backend (see above)

### **Issue 2: SSL Certificate Error**
```
NET::ERR_CERT_AUTHORITY_INVALID
```
**Solution**: Accept the certificate or configure development certificates
```bash
dotnet dev-certs https --trust
```

### **Issue 3: API Not Found**
```
404 - Cannot GET /api/admin/auth/login
```
**Solution**: Ensure backend controllers are properly registered and routes are correct

### **Issue 4: Authentication Fails**
```
401 Unauthorized
```
**Solution**: 
- Check JWT configuration
- Verify user credentials in database
- Ensure token is being sent in Authorization header

## 📊 **Database Schema**

Your backend should have these tables:

```sql
-- Admin Users
CREATE TABLE AdminUsers (
    Id int IDENTITY(1,1) PRIMARY KEY,
    FirstName nvarchar(100) NOT NULL,
    LastName nvarchar(100) NOT NULL,
    Email nvarchar(255) NOT NULL UNIQUE,
    PasswordHash nvarchar(255) NOT NULL,
    Role nvarchar(50) NOT NULL DEFAULT 'Admin',
    IsActive bit NOT NULL DEFAULT 1,
    CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 NOT NULL DEFAULT GETUTCDATE()
);

-- Posts
CREATE TABLE Posts (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Title nvarchar(255) NOT NULL,
    Slug nvarchar(255) NOT NULL UNIQUE,
    Content ntext NOT NULL,
    Excerpt nvarchar(500),
    FeaturedImage nvarchar(500),
    CategoryId int,
    AuthorId int NOT NULL,
    Status nvarchar(20) NOT NULL DEFAULT 'draft',
    IsFeatured bit NOT NULL DEFAULT 0,
    AllowComments bit NOT NULL DEFAULT 1,
    ViewCount int NOT NULL DEFAULT 0,
    PublishedAt datetime2,
    CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (AuthorId) REFERENCES AdminUsers(Id)
);

-- Categories
CREATE TABLE Categories (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Name nvarchar(100) NOT NULL,
    Slug nvarchar(100) NOT NULL UNIQUE,
    Description nvarchar(500),
    ParentId int NULL,
    Color nvarchar(7) NOT NULL DEFAULT '#3B82F6',
    PostCount int NOT NULL DEFAULT 0,
    CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (ParentId) REFERENCES Categories(Id)
);

-- Comments
CREATE TABLE Comments (
    Id int IDENTITY(1,1) PRIMARY KEY,
    PostId int NOT NULL,
    AuthorName nvarchar(100) NOT NULL,
    AuthorEmail nvarchar(255) NOT NULL,
    Content ntext NOT NULL,
    Status nvarchar(20) NOT NULL DEFAULT 'pending',
    ParentId int NULL,
    IpAddress nvarchar(45),
    UserAgent nvarchar(500),
    Likes int NOT NULL DEFAULT 0,
    Dislikes int NOT NULL DEFAULT 0,
    IsReported bit NOT NULL DEFAULT 0,
    CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (PostId) REFERENCES Posts(Id),
    FOREIGN KEY (ParentId) REFERENCES Comments(Id)
);

-- Newsletter Subscribers
CREATE TABLE NewsletterSubscribers (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Email nvarchar(255) NOT NULL UNIQUE,
    FirstName nvarchar(100),
    LastName nvarchar(100),
    Status nvarchar(20) NOT NULL DEFAULT 'active',
    Source nvarchar(50) NOT NULL DEFAULT 'website',
    SubscribedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    UnsubscribedAt datetime2 NULL
);
```

## 🎯 **Next Steps**

1. **Start your .NET backend** with the required endpoints
2. **Update the API URLs** in the frontend if needed
3. **Test the connection** using the admin login
4. **Implement remaining endpoints** as needed
5. **Deploy both applications** when ready

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Check .NET backend logs
3. Verify database connections
4. Test API endpoints directly
5. Ensure CORS is properly configured

---

*This integration will give you a fully functional TechBirds CMS with React frontend and .NET 9 backend!*
