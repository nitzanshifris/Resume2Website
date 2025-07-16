#!/bin/bash
# CV2WEB Portfolio Generation Command  
# Manages portfolio generation system and sandbox environments

claude -p prompts/portfolio-generation.md -- \
"PORTFOLIO GENERATION TASK:

Analyze and optimize the portfolio generation system for CV2WEB. Focus on:

1. SANDBOX MANAGEMENT: Review isolated environment creation and management
2. TEMPLATE SYSTEM: Validate template architecture and data adapters  
3. SERVER MANAGEMENT: Check Next.js server process management
4. DATA INJECTION: Verify CV data transformation and injection
5. PERFORMANCE: Assess generation speed and resource usage

Key areas to examine:
- src/api/routes/portfolio_generator.py
- src/templates/v0_template_1/lib/cv-data-adapter.tsx
- NextJSServerManager class implementation
- Port allocation and health monitoring
- Template registration and validation
- Sandbox environment isolation

Provide actionable improvements for generation reliability and performance."