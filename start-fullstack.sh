#!/bin/bash

# TechBirds Full-Stack Development Startup Script

echo "🚀 Starting TechBirds Full-Stack Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend directory
BACKEND_DIR="/Users/alirazatahir/Desktop/Work/Project/Website/TechBirds/Backend"
FRONTEND_DIR="/Users/alirazatahir/Desktop/Work/Project/Website/TechBirds/Frontend"

echo -e "${BLUE}📁 Project Directories:${NC}"
echo "Frontend: $FRONTEND_DIR"
echo "Backend:  $BACKEND_DIR"
echo ""

# Check if .NET is installed
echo -e "${BLUE}🔍 Checking .NET installation...${NC}"
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo -e "${GREEN}✅ .NET CLI found: v$DOTNET_VERSION${NC}"
else
    echo -e "${RED}❌ .NET CLI not found. Please install .NET 9 SDK${NC}"
    echo "Download: https://dotnet.microsoft.com/download"
    exit 1
fi

# Check if Node.js is installed
echo -e "${BLUE}🔍 Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Development Setup Options:${NC}"
echo "1. Start Backend Only"
echo "2. Start Frontend Only"  
echo "3. Start Both (Recommended)"
echo "4. Setup Backend Project"
echo "5. Exit"
echo ""

read -p "Choose option (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Starting Backend...${NC}"
        if [ -d "$BACKEND_DIR" ]; then
            cd "$BACKEND_DIR"
            echo "📁 Changed to: $(pwd)"
            echo -e "${YELLOW}🔄 Running: dotnet run${NC}"
            dotnet run
        else
            echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
        fi
        ;;
    2)
        echo -e "${BLUE}🚀 Starting Frontend...${NC}"
        cd "$FRONTEND_DIR"
        echo "📁 Changed to: $(pwd)"
        echo -e "${YELLOW}🔄 Running: npm run dev${NC}"
        npm run dev
        ;;
    3)
        echo -e "${BLUE}🚀 Starting Both Frontend and Backend...${NC}"
        echo -e "${YELLOW}This will open two terminal windows${NC}"
        
        # Start backend in new terminal
        osascript -e "tell application \"Terminal\" to do script \"cd '$BACKEND_DIR' && echo '🔥 Starting TechBirds Backend...' && dotnet run\""
        
        # Small delay
        sleep 2
        
        # Start frontend in current terminal
        echo -e "${GREEN}✅ Backend started in new terminal${NC}"
        echo -e "${BLUE}🚀 Starting Frontend in current terminal...${NC}"
        cd "$FRONTEND_DIR"
        npm run dev
        ;;
    4)
        echo -e "${BLUE}📖 Backend Setup Guide${NC}"
        echo "Please follow these steps in your .NET project:"
        echo ""
        echo -e "${YELLOW}1. Add CORS configuration to Program.cs${NC}"
        echo -e "${YELLOW}2. Create API controllers (Articles, Categories, Authors, etc.)${NC}"
        echo -e "${YELLOW}3. Update launchSettings.json with correct ports${NC}"
        echo ""
        echo -e "${GREEN}📋 Detailed guide available in: BACKEND-SETUP-GUIDE.md${NC}"
        
        if command -v code &> /dev/null; then
            read -p "Open setup guide in VS Code? (y/n): " open_guide
            if [[ $open_guide =~ ^[Yy]$ ]]; then
                code "$FRONTEND_DIR/BACKEND-SETUP-GUIDE.md"
            fi
        fi
        ;;
    5)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac
