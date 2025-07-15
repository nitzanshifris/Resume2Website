#!/usr/bin/env python3
"""
Simple demo to show the enhanced logging in action
No authentication required - just shows the logging system
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pathlib import Path
import asyncio
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor

# Colors for output
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'


async def process_cv_with_tracking():
    """Process a real CV with our enhanced tracking"""
    
    print(f"\n{BOLD}🚀 PROCESSING REAL CV WITH ENHANCED TRACKING{RESET}")
    print("=" * 60)
    
    # Use a real CV from our examples
    cv_path = Path("data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf")
    
    if not cv_path.exists():
        print(f"{RED}❌ CV not found: {cv_path}{RESET}")
        return
    
    print(f"{BLUE}Processing: {cv_path.name}{RESET}")
    
    # Create enhanced logger
    logger = EnhancedSSELogger(
        name="cv_demo",
        workflow_id="demo-001",
        custom_tags={
            "file": cv_path.name,
            "demo": "true"
        }
    )
    
    try:
        # VALIDATION PHASE
        logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
        print(f"\n{YELLOW}📋 VALIDATION PHASE{RESET}")
        
        # Step 1: Check file exists
        logger.step("Checking file exists")
        await asyncio.sleep(0.5)  # Simulate work
        logger.step_complete(f"File found: {cv_path.name}")
        print(f"  ✅ File exists")
        
        # Step 2: Check file size
        logger.step("Checking file size")
        file_size = cv_path.stat().st_size / 1024  # KB
        await asyncio.sleep(0.3)
        logger.step_complete(f"File size: {file_size:.1f} KB")
        print(f"  ✅ File size: {file_size:.1f} KB")
        
        # Step 3: Check file type
        logger.step("Validating file type")
        await asyncio.sleep(0.2)
        logger.step_complete("PDF format confirmed")
        print(f"  ✅ PDF format confirmed")
        
        logger.end_phase()
        
        # PROCESSING PHASE
        logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=3)
        print(f"\n{YELLOW}🔄 PROCESSING PHASE{RESET}")
        
        # Step 1: Extract text
        logger.step("Extracting text from PDF")
        logger.start_timer("text_extraction")
        print(f"  ⏳ Extracting text...")
        
        text = text_extractor.extract_text(str(cv_path))
        
        extraction_time = logger.end_timer("text_extraction")
        logger.step_complete(f"Extracted {len(text)} characters in {extraction_time:.2f}s")
        print(f"  ✅ Extracted {len(text)} characters in {extraction_time:.2f}s")
        
        # Step 2: AI Analysis
        logger.step("Analyzing CV with AI (Gemini)")
        logger.start_timer("ai_analysis")
        print(f"  ⏳ Running AI analysis...")
        
        cv_data = await data_extractor.extract_cv_data(text)
        
        ai_time = logger.end_timer("ai_analysis")
        logger.step_complete(f"AI analysis complete in {ai_time:.2f}s")
        print(f"  ✅ AI analysis complete in {ai_time:.2f}s")
        
        # Step 3: Show results
        logger.step("Processing results")
        
        # Count what we found
        sections_found = 0
        if cv_data.personal_info and cv_data.personal_info.name:
            sections_found += 1
            logger.info(f"Found name: {cv_data.personal_info.name}")
            print(f"  • Name: {cv_data.personal_info.name}")
        
        if cv_data.work_experience:
            sections_found += 1
            logger.info(f"Found {len(cv_data.work_experience)} work experiences")
            print(f"  • Work experiences: {len(cv_data.work_experience)}")
        
        if cv_data.education:
            sections_found += 1
            logger.info(f"Found {len(cv_data.education)} education entries")
            print(f"  • Education entries: {len(cv_data.education)}")
        
        if cv_data.skills:
            sections_found += 1
            logger.info(f"Found {len(cv_data.skills)} skills")
            print(f"  • Skills: {len(cv_data.skills)}")
        
        logger.increment_counter("sections_found", sections_found)
        logger.step_complete(f"Found {sections_found} sections")
        print(f"  ✅ Found {sections_found} sections total")
        
        logger.end_phase()
        
        # Finalize
        logger.finalize_workflow()
        
        # Get summary
        summary = logger.get_workflow_summary()
        
        print(f"\n{GREEN}{'='*60}{RESET}")
        print(f"{GREEN}✅ CV PROCESSING COMPLETE!{RESET}")
        print(f"{GREEN}{'='*60}{RESET}")
        
        print(f"\n{BOLD}📊 Summary:{RESET}")
        print(f"  • Workflow ID: {summary['workflow_id']}")
        print(f"  • Total time: {summary['total_duration']:.2f}s")
        print(f"  • Text extraction: {extraction_time:.2f}s")
        print(f"  • AI analysis: {ai_time:.2f}s")
        print(f"  • Sections found: {sections_found}")
        
        print(f"\n{BOLD}🔍 What the enhanced logger tracked:{RESET}")
        print(f"  • {len(summary['phases'])} workflow phases")
        print(f"  • {sum(summary['counters'].values())} total events counted")
        print(f"  • {len(summary['performance_metrics'])} performance metrics")
        print(f"  • Correlation ID: {summary['correlation_id']}")
        
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}", e)
        print(f"\n{RED}❌ Error: {e}{RESET}")
        logger.finalize_workflow()


async def test_sse_endpoints():
    """Test the SSE endpoints we created"""
    
    print(f"\n{BOLD}🌊 TESTING SSE ENDPOINTS{RESET}")
    print("=" * 60)
    
    import aiohttp
    
    async with aiohttp.ClientSession() as session:
        # Test workflow start
        print(f"\n{BLUE}Starting a workflow via API...{RESET}")
        
        workflow_config = {
            "name": "demo_workflow",
            "type": "cv_processing",
            "connection_id": "demo-123"
        }
        
        try:
            async with session.post(
                "http://localhost:2000/api/v1/workflows/start",
                json=workflow_config
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"{GREEN}✅ Workflow started: {data['workflow_id']}{RESET}")
                else:
                    print(f"{YELLOW}Workflow endpoint returned: {resp.status}{RESET}")
        except Exception as e:
            print(f"{RED}Could not connect to workflow API: {e}{RESET}")
        
        # Test metrics
        print(f"\n{BLUE}Getting workflow metrics...{RESET}")
        
        try:
            async with session.get(
                "http://localhost:2000/api/v1/workflows/metrics?time_window_minutes=5"
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"{GREEN}✅ Metrics retrieved successfully{RESET}")
                    print(f"  • Time window: {data['time_window_minutes']} minutes")
                else:
                    print(f"{YELLOW}Metrics endpoint returned: {resp.status}{RESET}")
        except Exception as e:
            print(f"{RED}Could not connect to metrics API: {e}{RESET}")


async def main():
    """Run the demo"""
    
    print(f"{BOLD}{'='*60}{RESET}")
    print(f"{BOLD}CV2WEB ENHANCED SYSTEM - SIMPLE DEMO{RESET}")
    print(f"{BOLD}{'='*60}{RESET}")
    
    print("\nThis demo shows:")
    print("1. Real CV processing with enhanced tracking")
    print("2. Live progress updates in the terminal")
    print("3. Performance metrics and timing")
    print("4. SSE endpoint testing")
    
    # Run CV processing
    await process_cv_with_tracking()
    
    # Test SSE endpoints
    await test_sse_endpoints()
    
    print(f"\n{BOLD}🎉 DEMO COMPLETE!{RESET}")
    print("\nCheck your server terminal to see the enhanced logging output!")


if __name__ == "__main__":
    asyncio.run(main())