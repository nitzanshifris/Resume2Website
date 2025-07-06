#!/bin/bash

echo "🚀 Running MCP-based Portfolios with Design Rules"
echo "==============================================="

# Run each portfolio with its specific name on new ports
echo "Starting Minimalist portfolio on port 3006..."
cd portfolio-minimalist && npm install && PORT=3006 npm run dev &
cd ..

echo "Starting Retro Cyberpunk portfolio on port 3007..."
cd portfolio-retro-cyberpunk && npm install && PORT=3007 npm run dev &
cd ..

echo "Starting Modern Business portfolio on port 3008..."
cd portfolio-modern-business && npm install && PORT=3008 npm run dev &
cd ..

echo "Starting Creative Showcase portfolio on port 3009..."
cd portfolio-creative-showcase && npm install && PORT=3009 npm run dev &
cd ..

echo "Starting Tech Forward portfolio on port 3010..."
cd portfolio-tech-forward && npm install && PORT=3010 npm run dev &
cd ..

echo "
✅ All portfolios are starting up!

Access them at:
- http://localhost:3006 (Minimalist)
- http://localhost:3007 (Retro Cyberpunk)  
- http://localhost:3008 (Modern Business)
- http://localhost:3009 (Creative Showcase)
- http://localhost:3010 (Tech Forward)

Note: Wait a moment for npm install to complete for each portfolio.
"

wait