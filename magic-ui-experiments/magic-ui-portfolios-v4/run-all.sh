#!/bin/bash
echo "🚀 Running Enhanced MCP Portfolios V4"
echo "===================================="

cd magic-ui-portfolios-v4

# Start each portfolio

echo "Starting Neon Cyberpunk on port 3016..."
(cd portfolio-neon-cyberpunk && PORT=3016 npm run dev) &

echo "Starting Minimalist Zen on port 3017..."
(cd portfolio-minimalist-zen && PORT=3017 npm run dev) &

echo "Starting Brutalist Bold on port 3018..."
(cd portfolio-brutalist-bold && PORT=3018 npm run dev) &

echo "Starting Glassmorphism Modern on port 3019..."
(cd portfolio-glassmorphism && PORT=3019 npm run dev) &

echo "Starting Retro Wave on port 3020..."
(cd portfolio-retro-wave && PORT=3020 npm run dev) &


echo "
✅ All portfolios running!

Access at:
- http://localhost:3016 (Neon Cyberpunk)
- http://localhost:3017 (Minimalist Zen)
- http://localhost:3018 (Brutalist Bold)
- http://localhost:3019 (Glassmorphism Modern)
- http://localhost:3020 (Retro Wave)

Press Ctrl+C to stop all portfolios
"

wait
