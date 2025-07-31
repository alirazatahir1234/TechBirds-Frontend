# 🚀 TechBirds Quick Start Guide

## ⚡ Fastest Way to Start Both Projects

```bash
# Run the full-stack startup script
./start-fullstack.sh
```

**This will:**
1. ✅ Check system requirements (.NET, Node.js)
2. 🚀 Start backend in new terminal window
3. 🚀 Start frontend in current terminal
4. 🔗 Test connection automatically

## 🔧 Manual Start (Alternative)

### Option 1: Start Backend First
```bash
# Terminal 1 - Backend
cd ../Backend
dotnet run

# Terminal 2 - Frontend  
npm run dev
```

### Option 2: Use NPM Scripts
```bash
# Start backend only
npm run start:backend

# Start full-stack
npm run start:fullstack

# Test connection only
npm run test:connection
```

## 🌐 Default URLs

- **Frontend**: http://localhost:5173
- **Backend**: https://localhost:7001
- **Backend Swagger**: https://localhost:7001/swagger

## 🔍 Troubleshooting

### 1. Backend Not Starting
```bash
# Check .NET installation
dotnet --version

# Restore packages
cd ../Backend
dotnet restore
dotnet build
```

### 2. CORS Errors in Browser
- Add CORS configuration to your .NET `Program.cs`
- Restart backend after CORS changes
- Check browser console for specific error

### 3. Port Conflicts
- Backend: Change port in `launchSettings.json`
- Frontend: Change port with `npm run dev -- --port 3000`

### 4. SSL Certificate Issues
```bash
# Trust development certificates
dotnet dev-certs https --trust

# Or use HTTP instead of HTTPS
# Update .env.local: VITE_API_BASE_URL=http://localhost:5000/api
```

## 📋 Development Checklist

- [ ] .NET 9 SDK installed
- [ ] Node.js 18+ installed  
- [ ] Backend project has CORS configured
- [ ] Backend running on correct port
- [ ] Frontend `.env.local` has correct API URL
- [ ] Browser console shows "✅ Backend connected successfully!"

## 🆘 Need Help?

1. **Check browser console** for connection status
2. **Review setup guide**: `BACKEND-SETUP-GUIDE.md`
3. **Run connection test**: `npm run test:connection`
4. **Use startup script**: `./start-fullstack.sh`

## 🎯 What's Next?

1. ✅ Get both servers running
2. 🔗 Verify connection in browser console
3. 🏗️ Implement backend API endpoints
4. 🎨 Customize frontend design
5. 🚀 Deploy to production

Happy coding! 🔥
