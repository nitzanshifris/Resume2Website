#!/bin/bash

# CV2WEB Complete System Startup Script
echo "🚀 Starting CV2WEB Complete System..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null
}

# Function to start a service in background
start_service() {
    local name=$1
    local command=$2
    local port=$3
    local logfile=$4
    
    echo -e "${YELLOW}Starting $name on port $port...${NC}"
    
    if check_port $port; then
        echo -e "${GREEN}✅ $name already running on port $port${NC}"
    else
        eval "$command" > "$logfile" 2>&1 &
        local pid=$!
        echo $pid > "${name}.pid"
        
        # Wait a moment and check if service started
        sleep 3
        if check_port $port; then
            echo -e "${GREEN}✅ $name started successfully (PID: $pid)${NC}"
        else
            echo -e "${RED}❌ Failed to start $name${NC}"
            if [ -f "$logfile" ]; then
                echo "Last few lines from log:"
                tail -5 "$logfile"
            fi
        fi
    fi
}

# Create logs directory
mkdir -p logs

echo "📋 System Prerequisites Check..."

# Check Python
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python3 found${NC}"
else
    echo -e "${RED}❌ Python3 not found${NC}"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js found${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

echo ""
echo "🎯 Starting Services..."

# 1. Start Model Router (port 8001)
start_service "ModelRouter" "cd ../apps/backend/services/model_router && python3 model_router.py" 8001 "logs/model_router.log"

# 2. Start Main Backend (port 8000)
start_service "Backend" "cd ../apps/backend && python3 run.py" 8000 "logs/backend.log"

# 3. Start Frontend (port 3000)
start_service "Frontend" "cd .. && npm run dev" 3000 "logs/frontend.log"

echo ""
echo "⏳ Waiting for all services to be ready..."
sleep 5

echo ""
echo "🔍 Service Status Check..."

# Check all services
services=("ModelRouter:8001" "Backend:8000" "Frontend:3000")
all_running=true

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if check_port $port; then
        echo -e "${GREEN}✅ $name running on port $port${NC}"
    else
        echo -e "${RED}❌ $name not running on port $port${NC}"
        all_running=false
    fi
done

echo ""
if [ "$all_running" = true ]; then
    echo -e "${GREEN}🎉 All services are running successfully!${NC}"
    echo ""
    echo "📱 Access URLs:"
    echo "   🌐 Frontend:     http://localhost:3000"
    echo "   🔧 Backend API:  http://localhost:8000/docs"
    echo "   🤖 Model Router: http://localhost:8001/stats"
    echo ""
    echo "🔄 To test the complete flow:"
    echo "   1. Go to http://localhost:3000"
    echo "   2. Upload a CV file"
    echo "   3. Watch the automatic processing pipeline!"
    echo ""
    echo "📊 Monitor costs and usage:"
    echo "   curl http://localhost:8001/stats | python3 -m json.tool"
    echo ""
    echo "🛑 To stop all services:"
    echo "   ./stop_cv2web.sh"
else
    echo -e "${RED}❌ Some services failed to start. Check logs in ./logs/${NC}"
    echo ""
    echo "🔧 Manual startup commands:"
    echo "   Model Router: cd ../apps/backend/services/model_router && python3 model_router.py"
    echo "   Backend:      cd ../apps/backend && python3 run.py"
    echo "   Frontend:     cd .. && npm run dev"
fi

echo ""
echo "📝 Log files:"
ls -la logs/ 2>/dev/null || echo "No logs directory found"