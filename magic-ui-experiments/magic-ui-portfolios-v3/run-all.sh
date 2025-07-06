#!/bin/bash
echo "🚀 Running Enhanced MCP Portfolios"
echo "================================="

# Already in the correct directory

# Array of portfolio directories and ports
portfolios=(
  "portfolio-neon-dark:3011"
  "portfolio-minimalist-clean:3012"
  "portfolio-artistic-bold:3013"
  "portfolio-tech-innovative:3014"
  "portfolio-magazine-editorial:3015"
)

# Start each portfolio
for portfolio in "${portfolios[@]}"; do
  IFS=':' read -r dir port <<< "$portfolio"
  echo "Starting $dir on port $port..."
  (cd "$dir" && PORT=$port npm run dev) &
done

echo "
✅ All portfolios running!

Access at:
- http://localhost:3011 (Neon Dark)
- http://localhost:3012 (Minimalist Clean)
- http://localhost:3013 (Artistic Bold)
- http://localhost:3014 (Tech Innovative)
- http://localhost:3015 (Magazine Editorial)

Press Ctrl+C to stop all portfolios
"

wait
