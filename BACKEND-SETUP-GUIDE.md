# 🔗 .NET 9 Backend Setup for TechBirds

## 📋 Required Backend Configuration

### 1. Add CORS in Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ ADD CORS CONFIGURATION
builder.Services.AddCors(options =>
{
    options.AddPolicy("TechBirdsFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",    // Vite dev server
            "https://localhost:5173",   // Vite HTTPS
            "http://localhost:3000",    // Alternative port
            "https://localhost:3000"    // Alternative HTTPS
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .SetIsOriginAllowed(origin => true); // Allow any origin in development
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ USE CORS (MUST BE BEFORE UseAuthorization)
app.UseCors("TechBirdsFrontend");

app.UseAuthorization();
app.MapControllers();

app.Run();
```

### 2. Required Controllers

Create these controllers in your backend:

#### ArticlesController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetArticles([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string category = "", [FromQuery] string search = "")
    {
        // Your implementation
        return Ok(new { data = new List<object>(), totalCount = 0, page, pageSize = limit });
    }

    [HttpGet("featured")]
    public IActionResult GetFeaturedArticles()
    {
        // Your implementation
        return Ok(new List<object>());
    }

    [HttpGet("trending")]
    public IActionResult GetTrendingArticles([FromQuery] int limit = 10)
    {
        // Your implementation
        return Ok(new List<object>());
    }

    [HttpGet("{id}")]
    public IActionResult GetArticle(int id)
    {
        // Your implementation
        return Ok(new { });
    }
}
```

#### CategoriesController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetCategories()
    {
        // Your implementation
        return Ok(new List<object>());
    }

    [HttpGet("{id}/articles")]
    public IActionResult GetCategoryArticles(int id)
    {
        // Your implementation
        return Ok(new List<object>());
    }
}
```

#### AuthorsController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAuthors()
    {
        // Your implementation
        return Ok(new List<object>());
    }

    [HttpGet("{id}")]
    public IActionResult GetAuthor(int id)
    {
        // Your implementation
        return Ok(new { });
    }

    [HttpGet("{id}/articles")]
    public IActionResult GetAuthorArticles(int id)
    {
        // Your implementation
        return Ok(new List<object>());
    }
}
```

#### NewsletterController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    [HttpPost("subscribe")]
    public IActionResult Subscribe([FromBody] EmailRequest request)
    {
        // Your implementation
        return Ok(new { success = true, message = "Subscribed successfully" });
    }
}

public class EmailRequest
{
    public string Email { get; set; }
}
```

#### SearchController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    [HttpGet]
    public IActionResult Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        // Your implementation
        return Ok(new { data = new List<object>(), totalCount = 0, page, pageSize = limit });
    }
}
```

### 3. Data Models (Example)

```csharp
public class Article
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string Excerpt { get; set; }
    public string Slug { get; set; }
    public string ImageUrl { get; set; }
    public DateTime PublishedAt { get; set; }
    public Category Category { get; set; }
    public Author Author { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
}

public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; }
}
```

### 4. Launch Settings (launchSettings.json)

Make sure your `Properties/launchSettings.json` includes:

```json
{
  "profiles": {
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:7001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

### 5. Quick Start Commands

```bash
# Start backend
dotnet run

# Or with specific profile
dotnet run --launch-profile https

# Build
dotnet build

# Restore packages
dotnet restore
```

## ✅ Verification Checklist

- [ ] CORS configured with frontend URLs
- [ ] All controllers created
- [ ] Backend running on https://localhost:7001
- [ ] Swagger UI accessible at https://localhost:7001/swagger
- [ ] Frontend can connect to backend (check browser console)

## 🔧 Common Issues & Solutions

### SSL Certificate Issues
If you get SSL errors:
1. Trust the development certificate: `dotnet dev-certs https --trust`
2. Or use HTTP: Update frontend to `http://localhost:5000/api`

### Port Conflicts
If port 7001 is busy:
1. Change port in `launchSettings.json`
2. Update frontend `.env.local` file

### CORS Errors
If you see CORS errors:
1. Verify CORS configuration is before `UseAuthorization()`
2. Check frontend URL is in CORS policy
3. Restart backend after CORS changes
