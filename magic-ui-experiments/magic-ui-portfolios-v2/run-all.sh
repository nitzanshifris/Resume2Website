#!/bin/bash
echo "🚀 Running MCP-based Portfolios with Design Rules"
echo "==============================================="

for i in {1..5}; do
  echo "Starting portfolio $i on port 300$i..."
  cd portfolio-*$i* && PORT=300$i npm run dev &
  cd ..
done

echo "
✅ All portfolios running!

Access at:
- http://localhost:3001 (Minimalist)
- http://localhost:3002 (Retro Cyberpunk)  
- http://localhost:3003 (Modern Business)
- http://localhost:3004 (Creative Showcase)
- http://localhost:3005 (Tech Forward)
"

wait