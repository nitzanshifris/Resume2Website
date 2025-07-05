#!/bin/bash

# CV2WEB System Shutdown Script
echo "🛑 Stopping CV2WEB System..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to stop service by PID file
stop_service_by_pid() {
    local name=$1
    local pidfile="${name}.pid"
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}Stopping $name (PID: $pid)...${NC}"
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${YELLOW}Force killing $name...${NC}"
                kill -9 $pid
            fi
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${YELLOW}$name not running (stale PID file)${NC}"
        fi
        rm -f "$pidfile"
    else
        echo -e "${YELLOW}No PID file for $name${NC}"
    fi
}

# Function to stop service by port
stop_service_by_port() {
    local name=$1
    local port=$2
    
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Stopping $name on port $port (PID: $pid)...${NC}"
        kill $pid
        sleep 2
        
        # Check if still running
        local new_pid=$(lsof -ti:$port)
        if [ ! -z "$new_pid" ]; then
            echo -e "${YELLOW}Force killing $name...${NC}"
            kill -9 $new_pid
        fi
        echo -e "${GREEN}✅ $name stopped${NC}"
    else
        echo -e "${GREEN}$name not running on port $port${NC}"
    fi
}

echo "🔍 Checking running services..."

# Stop services by PID files first
stop_service_by_pid "ModelRouter"
stop_service_by_pid "Backend" 
stop_service_by_pid "Frontend"

echo ""
echo "🔍 Checking ports for any remaining processes..."

# Stop by ports as backup
stop_service_by_port "ModelRouter" 8001
stop_service_by_port "Backend" 8000
stop_service_by_port "Frontend" 3000

# Also check for common Next.js ports
stop_service_by_port "Frontend-Alt" 3001
stop_service_by_port "Frontend-Alt2" 3002

echo ""
echo "🧹 Cleaning up..."

# Remove PID files
rm -f *.pid

# Clean up any Node.js processes that might be lingering
pkill -f "next"
pkill -f "npm run dev"

echo ""
echo -e "${GREEN}🎉 CV2WEB system stopped successfully!${NC}"
echo ""
echo "📝 Service status:"
ports=(8001 8000 3000 3001 3002)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo -e "   Port $port: ${RED}Still in use${NC}"
    else
        echo -e "   Port $port: ${GREEN}Free${NC}"
    fi
done

echo ""
echo "🚀 To restart the system:"
echo "   ./start_cv2web.sh"