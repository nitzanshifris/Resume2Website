#!/bin/bash

echo "🚀 Magic UI Portfolio Runner"
echo "=========================="
echo ""
echo "Choose a portfolio to run:"
echo ""
echo "1) Minimalist Design (Port 3001)"
echo "2) Retro Cyberpunk (Port 3002)"
echo "3) Modern Business (Port 3003)"
echo "4) Creative Showcase (Port 3004)"
echo "5) Tech-Forward (Port 3005)"
echo "6) Run ALL portfolios"
echo ""
read -p "Enter your choice (1-6): " choice

run_portfolio() {
  local num=$1
  local port=$2
  local name=$3
  
  echo ""
  echo "Starting Portfolio $num: $name on port $port..."
  cd portfolio-$num
  
  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
  
  # Run on specific port
  PORT=$port npm run dev &
  cd ..
}

case $choice in
  1)
    run_portfolio 1 3001 "Minimalist Design"
    ;;
  2)
    run_portfolio 2 3002 "Retro Cyberpunk"
    ;;
  3)
    run_portfolio 3 3003 "Modern Business"
    ;;
  4)
    run_portfolio 4 3004 "Creative Showcase"
    ;;
  5)
    run_portfolio 5 3005 "Tech-Forward"
    ;;
  6)
    echo "Starting all portfolios..."
    run_portfolio 1 3001 "Minimalist Design"
    run_portfolio 2 3002 "Retro Cyberpunk"
    run_portfolio 3 3003 "Modern Business"
    run_portfolio 4 3004 "Creative Showcase"
    run_portfolio 5 3005 "Tech-Forward"
    echo ""
    echo "✅ All portfolios are running!"
    echo ""
    echo "Access them at:"
    echo "- Portfolio 1: http://localhost:3001"
    echo "- Portfolio 2: http://localhost:3002"
    echo "- Portfolio 3: http://localhost:3003"
    echo "- Portfolio 4: http://localhost:3004"
    echo "- Portfolio 5: http://localhost:3005"
    ;;
  *)
    echo "Invalid choice!"
    exit 1
    ;;
esac

echo ""
echo "Press Ctrl+C to stop the server(s)"
wait