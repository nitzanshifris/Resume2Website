#!/bin/bash

echo "🚀 Starting Component Gallery..."
cd ../apps/backend/templates/cv2web-react-template

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔧 Starting server on port 6001..."
npm run dev -- --port 6001 &

# Get the process ID
SERVER_PID=$!
echo "✅ Server started with PID: $SERVER_PID"

# Wait a bit for server to start
sleep 5

echo ""
echo "🌐 Component Gallery is running at:"
echo "   Main Gallery: http://localhost:6001/components-gallery"
echo "   3D Card Demo: http://localhost:6001/components-gallery/3d-card"
echo ""
echo "To stop the server, run: kill $SERVER_PID"