#!/bin/bash

# TechBirds Backend Starter Script
echo "🚀 Starting TechBirds Backend..."

# Navigate to backend directory
BACKEND_DIR="/Users/alirazatahir/Desktop/Work/Project/Website/TechBirds/Backend"

if [ -d "$BACKEND_DIR" ]; then
    echo "📁 Found backend directory: $BACKEND_DIR"
    cd "$BACKEND_DIR"
    
    # Check if .NET 9 is installed
    if command -v dotnet &> /dev/null; then
        echo "✅ .NET CLI found"
        dotnet --version
        
        # Try to start the backend
        echo "🔄 Starting .NET backend..."
        
        # Look for .csproj or .sln files
        if ls *.sln 1> /dev/null 2>&1; then
            echo "📦 Found solution file, running dotnet run..."
            dotnet run
        elif ls *.csproj 1> /dev/null 2>&1; then
            echo "📦 Found project file, running dotnet run..."
            dotnet run
        else
            echo "❌ No .NET project files found"
            echo "Make sure your backend has .csproj or .sln files"
        fi
    else
        echo "❌ .NET CLI not found"
        echo "Please install .NET 9 SDK: https://dotnet.microsoft.com/download"
    fi
else
    echo "❌ Backend directory not found: $BACKEND_DIR"
    echo "Please check if your backend project exists"
fi
