#!/bin/bash
# RESUME2WEBSITE Portfolio Generation Command  
# Manages portfolio generation system and sandbox environments

claude -p prompts/portfolio-generation.md -- \
"PORTFOLIO GENERATION TASK:

Analyze and optimize the portfolio generation system for RESUME2WEBSITE. Focus on:

1. SANDBOX MANAGEMENT: Review isolated environment creation and management
2. TEMPLATE SYSTEM: Validate template architecture and data adapters  
3. SERVER MANAGEMENT: Check Next.js server process management
4. DATA INJECTION: Verify CV data transformation and injection
5. PERFORMANCE: Assess generation speed and resource usage

Key areas to examine:
- src/api/routes/portfolio_generator.py
- src/templates/official_template_v1/lib/cv-data-adapter.tsx
- NextJSServerManager class implementation
- Port allocation and health monitoring (4000-5000)
- Template registration and validation
- Sandbox npm environment isolation (not pnpm)
- Resource limits (20 max, 512MB each) and 24-hour cleanup
- Two-stage process: Preview → Optional Deployment

Provide actionable improvements for generation reliability and performance."