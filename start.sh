#!/bin/bash

# Photography Portfolio Startup Script
# This script starts both the Strapi backend and Vue frontend

echo "🚀 Starting Photography Portfolio Application..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm globally..."
    npm install -g pnpm
fi

echo "✅ Prerequisites check passed"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd photography-portfolio/backend
pnpm install
cd ../..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd photography-portfolio/frontend
pnpm install
cd ../..

echo ""
echo "🎯 Starting both servers..."
echo "📍 Backend will run on: http://localhost:1337"
echo "📍 Frontend will run on: http://localhost:5173"
echo "📍 Strapi Admin will be available at: http://localhost:1337/admin"
echo ""
echo "⏳ Please wait for both servers to start..."
echo "🔄 Use Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev 