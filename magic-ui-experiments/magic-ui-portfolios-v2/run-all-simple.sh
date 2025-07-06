#!/bin/bash

echo "🚀 Running MCP-based Portfolios with Design Rules"
echo "==============================================="

# Start each portfolio in its own directory
cd /Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-portfolios-v2/portfolio-minimalist
npm install && PORT=3006 npm run dev &

cd /Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-portfolios-v2/portfolio-retro-cyberpunk
npm install && PORT=3007 npm run dev &

cd /Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-portfolios-v2/portfolio-modern-business
npm install && PORT=3008 npm run dev &

cd /Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-portfolios-v2/portfolio-creative-showcase
npm install && PORT=3009 npm run dev &

cd /Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-portfolios-v2/portfolio-tech-forward
npm install && PORT=3010 npm run dev &

echo "
✅ All portfolios are starting up!

Access them at:
- http://localhost:3006 (Minimalist) ✨
- http://localhost:3007 (Retro Cyberpunk) 🌆
- http://localhost:3008 (Modern Business) 💼
- http://localhost:3009 (Creative Showcase) 🎨
- http://localhost:3010 (Tech Forward) 💻

Note: Wait a moment for npm install to complete for each portfolio.
"

wait