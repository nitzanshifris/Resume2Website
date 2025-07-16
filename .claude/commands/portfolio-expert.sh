#!/bin/bash
# CV2WEB Portfolio Expert Command
# Manages and improves the AI portfolio expert system

claude -p prompts/portfolio-expert.md -- \
"PORTFOLIO EXPERT TASK:

Analyze and enhance the Portfolio Expert system for CV2WEB. Focus on:

1. EXPERT CAPABILITIES: Review AI guidance quality and recommendations
2. SESSION MANAGEMENT: Validate conversation history and context retention
3. INDUSTRY ANALYSIS: Check industry-specific advice accuracy
4. TEMPLATE RECOMMENDATIONS: Assess template matching algorithm
5. CONTENT SUGGESTIONS: Evaluate content improvement recommendations

Key areas to examine:
- src/services/claude_portfolio_expert.py
- src/api/routes/portfolio_expert.py
- CV analysis and completeness assessment
- Conversational AI intent recognition
- Industry-specific guidance frameworks
- Expert-guided portfolio generation

Provide specific improvements for expert system effectiveness."