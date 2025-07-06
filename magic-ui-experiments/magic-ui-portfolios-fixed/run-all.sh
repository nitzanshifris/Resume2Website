#!/bin/bash
echo "🚀 Running Fixed MCP Portfolios"
echo "=============================="

cd magic-ui-portfolios-fixed

# Start each portfolio

echo "Starting Dark Tech Professional on port 3026..."
(cd portfolio-dark-tech && PORT=3026 npm run dev) &

echo "Starting Creative Bright on port 3027..."
(cd portfolio-creative-bright && PORT=3027 npm run dev) &

echo "Starting Corporate Clean on port 3028..."
(cd portfolio-corporate-clean && PORT=3028 npm run dev) &

echo "Starting Modern Gradient on port 3029..."
(cd portfolio-modern-gradient && PORT=3029 npm run dev) &

echo "Starting Bold Minimal on port 3030..."
(cd portfolio-bold-minimal && PORT=3030 npm run dev) &


echo "
✅ All portfolios running!

Access at:
- http://localhost:3026 (Dark Tech Professional) - CV: Berlin-Simple-Resume-Template.pdf
- http://localhost:3027 (Creative Bright) - CV: Chicago-Resume-Template-Creative.pdf
- http://localhost:3028 (Corporate Clean) - CV: London-Resume-Template-Professional.pdf
- http://localhost:3029 (Modern Gradient) - CV: Amsterdam-Modern-Resume-Template.pdf
- http://localhost:3030 (Bold Minimal) - CV: Madrid-Resume-Template-Modern.pdf

Press Ctrl+C to stop all portfolios
"

wait
