# 🔗 TechBirds Full-Stack Connection Guide

## 🎯 Quick Start Both Projects

### 1. Start Frontend (Current Terminal)
```bash
# Already running on http://localhost:5173
npm run dev
```

### 2. Start Backend (New Terminal)
```bash
# Option A: Use the helper script
./start-backend.sh

# Option B: Manual start
cd ../Backend
dotnet run
```

## 📁 Project Structure
```
TechBirds/
├── Frontend/           # React.js + Vite + Tailwind CSS
│   ├── src/
│   ├── package.json
│   └── start-backend.sh
└── Backend/            # .NET 9 Web API
    ├── *.sln
    ├── *.csproj
    └── Controllers/
```

## 🔄 Development Workflow

### Frontend (Port 5173)
- ✅ **Running**: React development server
- ✅ **Styling**: Tailwind CSS v3 configured
- ✅ **Routing**: React Router DOM setup
- ✅ **API Integration**: Ready for backend connection

### Backend (Port 7001 or 5001)
- 🔄 **Needs to start**: .NET 9 Web API
- 🔄 **CORS**: Add frontend URL to CORS policy
- 🔄 **Endpoints**: Implement required API endpoints

## 🛠️ Backend Requirements

Add this to your `Program.cs`:

```csharp
// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("TechBirdsFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Use CORS
app.UseCors("TechBirdsFrontend");
```

## 🧪 Test Connection

1. Start both servers
2. Visit http://localhost:5173
3. Check browser console for connection status
4. Look for: ✅ "Backend connected successfully!"

## 📡 Required API Endpoints

Your backend should implement:
- `GET /api/articles` - Article list
- `GET /api/articles/{id}` - Single article
- `GET /api/categories` - Categories list
- `GET /api/authors` - Authors list
- `POST /api/newsletter/subscribe` - Newsletter signup

## 🚀 Next Steps

1. **Open Backend in VS Code** ✅ (Done)
2. **Start your .NET backend**
3. **Check connection in browser console**
4. **Implement missing API endpoints**

Happy coding! 🎉
