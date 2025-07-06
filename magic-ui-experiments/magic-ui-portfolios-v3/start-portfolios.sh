#!/bin/bash
echo "🚀 Starting Enhanced MCP Portfolios"
echo "================================="

# Start each portfolio in its own directory
echo "Starting Neon Dark on port 3011..."
(cd portfolio-neon-dark && PORT=3011 npm run dev > /dev/null 2>&1) &

echo "Starting Minimalist Clean on port 3012..."
(cd portfolio-minimalist-clean && PORT=3012 npm run dev > /dev/null 2>&1) &

echo "Starting Artistic Bold on port 3013..."
(cd portfolio-artistic-bold && PORT=3013 npm run dev > /dev/null 2>&1) &

echo "Starting Tech Innovative on port 3014..."
(cd portfolio-tech-innovative && PORT=3014 npm run dev > /dev/null 2>&1) &

echo "Starting Magazine Editorial on port 3015..."
(cd portfolio-magazine-editorial && PORT=3015 npm run dev > /dev/null 2>&1) &

sleep 5

echo "
✅ All portfolios should be running!

Access at:
- http://localhost:3011 (Neon Dark) 
- http://localhost:3012 (Minimalist Clean)
- http://localhost:3013 (Artistic Bold)
- http://localhost:3014 (Tech Innovative)
- http://localhost:3015 (Magazine Editorial)

To stop all: killall node
"