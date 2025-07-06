#!/bin/bash
echo "🚀 Running Final MCP Portfolios"
echo "==============================="

cd magic-ui-portfolios-final

# Start each portfolio

echo "Starting Tech Developer Dark on port 3021..."
echo "CV: Berlin-Simple-Resume-Template.pdf"
(cd portfolio-tech-developer && PORT=3021 npm run dev) &

echo "Starting Creative Designer on port 3022..."
echo "CV: Chicago-Resume-Template-Creative.pdf"
(cd portfolio-creative-designer && PORT=3022 npm run dev) &

echo "Starting Corporate Executive on port 3023..."
echo "CV: London-Resume-Template-Professional.pdf"
(cd portfolio-corporate-executive && PORT=3023 npm run dev) &

echo "Starting Modern Freelancer on port 3024..."
echo "CV: Amsterdam-Modern-Resume-Template.pdf"
(cd portfolio-modern-freelancer && PORT=3024 npm run dev) &

echo "Starting Startup Founder on port 3025..."
echo "CV: Madrid-Resume-Template-Modern.pdf"
(cd portfolio-startup-founder && PORT=3025 npm run dev) &


echo "
✅ All portfolios running!

Access at:
- http://localhost:3021 (Tech Developer Dark) - CV: Berlin-Simple-Resume-Template.pdf
- http://localhost:3022 (Creative Designer) - CV: Chicago-Resume-Template-Creative.pdf
- http://localhost:3023 (Corporate Executive) - CV: London-Resume-Template-Professional.pdf
- http://localhost:3024 (Modern Freelancer) - CV: Amsterdam-Modern-Resume-Template.pdf
- http://localhost:3025 (Startup Founder) - CV: Madrid-Resume-Template-Modern.pdf

Press Ctrl+C to stop all portfolios
"

wait
