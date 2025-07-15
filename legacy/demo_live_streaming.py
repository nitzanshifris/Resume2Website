#!/usr/bin/env python3
"""
Live Demo of CV2WEB Enhanced Streaming System
This script demonstrates all the new features we built
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime

# ANSI color codes for pretty terminal output
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

async def demo_1_basic_sse_heartbeat():
    """Demo 1: Basic SSE Heartbeat - Shows real-time server connection"""
    print(f"\n{BOLD}🌊 DEMO 1: Real-Time Server Heartbeat{RESET}")
    print("This shows that your server can stream live data to clients")
    print("-" * 50)
    
    async with aiohttp.ClientSession() as session:
        print(f"{BLUE}Connecting to SSE heartbeat endpoint...{RESET}")
        
        async with session.get(
            "http://localhost:2000/api/v1/sse/heartbeat",
            headers={"Accept": "text/event-stream"}
        ) as response:
            
            if response.status == 200:
                print(f"{GREEN}✅ Connected! Receiving live heartbeats:{RESET}")
                
                count = 0
                async for line in response.content:
                    if count >= 3:  # Show 3 heartbeats
                        break
                        
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data = json.loads(line[6:])
                        count += 1
                        print(f"  💓 Heartbeat #{count}: {data['timestamp']} - {data['connections']} active connections")
                
                print(f"{GREEN}✅ Heartbeat streaming works perfectly!{RESET}")
            else:
                print(f"{RED}❌ Failed to connect: HTTP {response.status}{RESET}")

async def demo_2_enhanced_logger():
    """Demo 2: Enhanced Logger - Shows workflow tracking with phases"""
    print(f"\n{BOLD}📝 DEMO 2: Enhanced Workflow Logger{RESET}")
    print("This shows how we track CV processing workflows with detailed phases")
    print("-" * 50)
    
    # Import our enhanced logger
    import sys
    sys.path.insert(0, '/Users/nitzan_shifris/Desktop/CV2WEB-V4')
    from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
    
    # Create a logger for CV processing
    logger = EnhancedSSELogger(
        "cv_processing_demo",
        enable_performance_tracking=True,
        custom_tags={"demo": "live", "user": "nitzan"}
    )
    
    print(f"{BLUE}Starting CV processing workflow...{RESET}")
    
    # Phase 1: Validation
    logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
    print(f"\n{YELLOW}📋 Phase 1: VALIDATION{RESET}")
    
    logger.step("Checking file format")
    await asyncio.sleep(0.5)
    logger.step_complete("File format is PDF ✓")
    
    logger.step("Validating file size")
    await asyncio.sleep(0.3)
    logger.step_complete("File size: 2.3MB (within limits) ✓")
    
    logger.step("Scanning for malware")
    await asyncio.sleep(0.7)
    logger.step_complete("File is safe ✓")
    
    logger.end_phase()
    
    # Phase 2: Processing
    logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=2)
    print(f"\n{YELLOW}🔄 Phase 2: PROCESSING{RESET}")
    
    logger.step("Extracting text with OCR")
    logger.start_timer("ocr_processing")
    await asyncio.sleep(1.0)
    duration = logger.end_timer("ocr_processing")
    logger.step_complete(f"Text extracted in {duration:.2f}s ✓")
    
    logger.step("Parsing CV structure")
    logger.increment_counter("sections_found", 5)
    logger.set_gauge("extraction_confidence", 0.92)
    await asyncio.sleep(0.5)
    logger.step_complete("Found 5 sections with 92% confidence ✓")
    
    logger.end_phase()
    
    # Get workflow summary
    summary = logger.get_workflow_summary()
    
    print(f"\n{GREEN}✅ Workflow completed!{RESET}")
    print(f"\n{BOLD}📊 Workflow Summary:{RESET}")
    print(f"  • Workflow ID: {summary['workflow_id']}")
    print(f"  • Total Duration: {summary['total_duration']:.2f}s")
    print(f"  • Sections Found: {summary['counters']['sections_found']}")
    print(f"  • Confidence: {summary['gauges']['extraction_confidence']*100:.0f}%")
    
    logger.finalize_workflow()
    
    return logger.workflow_id

async def demo_3_workflow_api():
    """Demo 3: Workflow API - Shows how to start and monitor workflows"""
    print(f"\n{BOLD}🔄 DEMO 3: Workflow Management API{RESET}")
    print("This shows how to start and track workflows via API")
    print("-" * 50)
    
    async with aiohttp.ClientSession() as session:
        # Start a workflow
        workflow_config = {
            "name": "cv_extraction_demo",
            "type": "cv_processing",
            "connection_id": "demo-connection-123",
            "estimated_duration": "30s",
            "user_email": "nitzan@example.com",
            "file_name": "resume.pdf"
        }
        
        print(f"{BLUE}Starting a new workflow via API...{RESET}")
        
        async with session.post(
            "http://localhost:2000/api/v1/workflows/start",
            json=workflow_config
        ) as response:
            
            if response.status == 200:
                data = await response.json()
                workflow_id = data["workflow_id"]
                print(f"{GREEN}✅ Workflow started!{RESET}")
                print(f"  • Workflow ID: {workflow_id}")
                print(f"  • Type: {data['config_received']['type']}")
                print(f"  • User: {data['config_received']['user_email']}")
            else:
                print(f"{RED}❌ Failed to start workflow{RESET}")
                return None
        
        # Get workflow metrics
        print(f"\n{BLUE}Fetching workflow metrics...{RESET}")
        
        async with session.get(
            "http://localhost:2000/api/v1/workflows/metrics?time_window_minutes=5"
        ) as response:
            
            if response.status == 200:
                metrics = await response.json()
                print(f"{GREEN}✅ Metrics retrieved!{RESET}")
                print(f"  • Time Window: {metrics['time_window_minutes']} minutes")
                print(f"  • Total Workflows: {len(metrics.get('correlation_statistics', {}).get('active_contexts', []))}")
                
                if 'aggregation_report' in metrics:
                    report = metrics['aggregation_report']
                    print(f"\n{BOLD}📊 Aggregation Report:{RESET}")
                    print(f"  • Total Log Entries: {report.get('total_entries', 0)}")
                    print(f"  • Error Rate: {report.get('error_rate', 0)*100:.1f}%")
                    print(f"  • Warning Rate: {report.get('warning_rate', 0)*100:.1f}%")
        
        return workflow_id

async def demo_4_error_handling():
    """Demo 4: Error Handling - Shows graceful error recovery"""
    print(f"\n{BOLD}🚨 DEMO 4: Error Handling & Recovery{RESET}")
    print("This shows how the system handles errors gracefully")
    print("-" * 50)
    
    async with aiohttp.ClientSession() as session:
        print(f"{BLUE}Testing error handling endpoint...{RESET}")
        
        async with session.get(
            "http://localhost:2000/api/v1/sse/test-error-handling",
            headers={"Accept": "text/event-stream"}
        ) as response:
            
            if response.status == 200:
                print(f"{GREEN}✅ Connected to error simulation{RESET}")
                
                async for line in response.content:
                    line = line.decode('utf-8').strip()
                    
                    if line.startswith('event: '):
                        event_type = line[7:]
                        print(f"\n  📨 Event Type: {BOLD}{event_type}{RESET}")
                    
                    elif line.startswith('data: '):
                        data = json.loads(line[6:])
                        
                        if 'step' in data:
                            print(f"  ✅ Step: {data['step']}")
                        elif 'warning' in data:
                            print(f"  {YELLOW}⚠️  Warning: {data['warning']}{RESET}")
                        elif 'error' in data:
                            print(f"  {RED}❌ Error: {data['error']}{RESET}")
                            if 'recovery' in data:
                                print(f"  {GREEN}🔧 Recovery: {data['recovery']}{RESET}")
                        elif 'sentinel_type' in data:
                            print(f"  {BLUE}🏁 Sentinel: {data['sentinel_type']} - {data['reason']}{RESET}")
                            break

async def demo_5_live_cv_processing():
    """Demo 5: Simulated Live CV Processing - Full workflow simulation"""
    print(f"\n{BOLD}🚀 DEMO 5: Live CV Processing Simulation{RESET}")
    print("This simulates a complete CV processing workflow with real-time updates")
    print("-" * 50)
    
    import sys
    sys.path.insert(0, '/Users/nitzan_shifris/Desktop/CV2WEB-V4')
    from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
    
    # Create logger for the workflow
    logger = EnhancedSSELogger(
        "live_cv_processing",
        workflow_id="cv-process-demo-001",
        custom_tags={"file": "john_doe_resume.pdf", "size": "2.3MB"}
    )
    
    print(f"{BLUE}Processing CV: john_doe_resume.pdf{RESET}")
    print(f"Workflow ID: {logger.workflow_id}")
    
    try:
        # VALIDATION PHASE
        logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=4)
        print(f"\n{YELLOW}📋 VALIDATION PHASE{RESET}")
        
        steps = [
            ("Checking file type", 0.3, "PDF format confirmed"),
            ("Validating file size", 0.2, "2.3MB - within 10MB limit"),
            ("Scanning for malware", 0.8, "No threats detected"),
            ("Checking file integrity", 0.4, "File structure valid")
        ]
        
        for step_name, delay, result in steps:
            logger.step(step_name)
            print(f"  ⏳ {step_name}...")
            await asyncio.sleep(delay)
            logger.step_complete(result)
            print(f"  ✅ {result}")
        
        logger.end_phase({"validation_score": 1.0})
        
        # PROCESSING PHASE
        logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=6)
        print(f"\n{YELLOW}🔄 PROCESSING PHASE{RESET}")
        
        # OCR Processing
        logger.step("Running OCR on document")
        logger.start_timer("ocr_processing")
        print(f"  ⏳ Extracting text from PDF...")
        await asyncio.sleep(1.5)
        ocr_time = logger.end_timer("ocr_processing")
        logger.increment_counter("pages_processed", 3)
        logger.step_complete(f"Extracted text from 3 pages in {ocr_time:.2f}s")
        print(f"  ✅ Text extraction complete ({ocr_time:.2f}s)")
        
        # AI Extraction
        logger.step("Running Gemini AI extraction")
        logger.start_timer("ai_extraction")
        print(f"  ⏳ Using Gemini 2.5 Flash to parse CV...")
        await asyncio.sleep(2.0)
        ai_time = logger.end_timer("ai_extraction")
        
        # Simulate finding CV sections
        sections = {
            "personal_info": 0.98,
            "work_experience": 0.95,
            "education": 0.97,
            "skills": 0.93,
            "projects": 0.89
        }
        
        for section, confidence in sections.items():
            logger.increment_counter(f"section_{section}", 1)
            logger.set_gauge(f"confidence_{section}", confidence)
        
        logger.step_complete(f"AI extraction complete in {ai_time:.2f}s")
        print(f"  ✅ AI extraction complete ({ai_time:.2f}s)")
        
        # Show extracted sections
        print(f"\n  {BOLD}📊 Extracted Sections:{RESET}")
        for section, confidence in sections.items():
            print(f"    • {section.replace('_', ' ').title()}: {confidence*100:.0f}% confidence")
        
        # Data structuring
        logger.step("Structuring extracted data")
        await asyncio.sleep(0.5)
        logger.step_complete("Data structured into CV schema")
        print(f"  ✅ Data structured successfully")
        
        # Validation
        logger.step("Validating extracted data")
        logger.set_gauge("overall_extraction_quality", 0.94)
        await asyncio.sleep(0.3)
        logger.step_complete("Data validation passed")
        print(f"  ✅ Data validation passed (94% quality)")
        
        # Enhancement
        logger.step("Enhancing data with Claude AI")
        await asyncio.sleep(1.0)
        logger.increment_counter("enhancements_made", 7)
        logger.step_complete("Added 7 enhancements")
        print(f"  ✅ Enhanced with 7 improvements")
        
        # Saving
        logger.step("Saving processed CV data")
        await asyncio.sleep(0.2)
        logger.step_complete("CV data saved to database")
        print(f"  ✅ Saved to database")
        
        logger.end_phase({"extraction_quality": 0.94})
        
        # GENERATION PHASE
        logger.start_phase(WorkflowPhase.GENERATION, expected_steps=3)
        print(f"\n{YELLOW}🎨 GENERATION PHASE{RESET}")
        
        logger.step("Selecting portfolio template")
        await asyncio.sleep(0.3)
        logger.step_complete("Selected 'Modern Professional' template")
        print(f"  ✅ Template: Modern Professional")
        
        logger.step("Generating portfolio website")
        logger.start_timer("portfolio_generation")
        print(f"  ⏳ Creating portfolio with Aceternity UI components...")
        await asyncio.sleep(1.5)
        gen_time = logger.end_timer("portfolio_generation")
        logger.increment_counter("components_used", 12)
        logger.step_complete(f"Portfolio generated in {gen_time:.2f}s")
        print(f"  ✅ Portfolio created with 12 components ({gen_time:.2f}s)")
        
        logger.step("Preparing deployment package")
        await asyncio.sleep(0.5)
        logger.step_complete("Deployment package ready")
        print(f"  ✅ Ready for Vercel deployment")
        
        logger.end_phase({"template": "modern_professional", "components": 12})
        
        # Show final summary
        logger.finalize_workflow()
        summary = logger.get_workflow_summary()
        
        print(f"\n{GREEN}{'='*60}{RESET}")
        print(f"{GREEN}{BOLD}✅ CV PROCESSING COMPLETE!{RESET}")
        print(f"{GREEN}{'='*60}{RESET}")
        
        print(f"\n{BOLD}📊 Final Statistics:{RESET}")
        print(f"  • Total Duration: {summary['total_duration']:.2f}s")
        print(f"  • Pages Processed: {summary['counters'].get('pages_processed', 0)}")
        print(f"  • Sections Found: 5")
        print(f"  • Overall Quality: {summary['gauges'].get('overall_extraction_quality', 0)*100:.0f}%")
        print(f"  • Enhancements: {summary['counters'].get('enhancements_made', 0)}")
        print(f"  • Components Used: {summary['counters'].get('components_used', 0)}")
        
        print(f"\n{BOLD}🚀 Next Steps:{RESET}")
        print(f"  1. Preview portfolio at: http://localhost:3000/preview/{logger.workflow_id}")
        print(f"  2. Deploy to Vercel with one click")
        print(f"  3. Share portfolio URL with candidate")
        
    except Exception as e:
        logger.error("Processing failed", e)
        print(f"\n{RED}❌ Error during processing: {e}{RESET}")

async def main():
    """Run all demos"""
    print(f"{BOLD}{'='*60}{RESET}")
    print(f"{BOLD}🎯 CV2WEB ENHANCED STREAMING SYSTEM - LIVE DEMO{RESET}")
    print(f"{BOLD}{'='*60}{RESET}")
    print("\nThis demo will show you all the new features we built:")
    print("1. Real-time streaming (SSE)")
    print("2. Enhanced workflow logging")
    print("3. Workflow management API")
    print("4. Error handling & recovery")
    print("5. Complete CV processing simulation")
    
    input(f"\n{YELLOW}Press Enter to start the demo...{RESET}")
    
    # Run demos
    await demo_1_basic_sse_heartbeat()
    input(f"\n{YELLOW}Press Enter for Demo 2...{RESET}")
    
    workflow_id = await demo_2_enhanced_logger()
    input(f"\n{YELLOW}Press Enter for Demo 3...{RESET}")
    
    await demo_3_workflow_api()
    input(f"\n{YELLOW}Press Enter for Demo 4...{RESET}")
    
    await demo_4_error_handling()
    input(f"\n{YELLOW}Press Enter for Demo 5 (Full CV Processing)...{RESET}")
    
    await demo_5_live_cv_processing()
    
    print(f"\n{BOLD}{'='*60}{RESET}")
    print(f"{GREEN}{BOLD}🎉 DEMO COMPLETE!{RESET}")
    print(f"{BOLD}{'='*60}{RESET}")
    
    print(f"\n{BOLD}📚 What You Can Do Now:{RESET}")
    print("1. Use the Enhanced Logger in your CV extraction code")
    print("2. Stream real-time updates to your frontend")
    print("3. Track performance metrics for optimization")
    print("4. Monitor workflows via the API")
    print("5. Handle errors gracefully with recovery")
    
    print(f"\n{BOLD}🔧 Integration Example:{RESET}")
    print("""
# In your CV extraction code:
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase

logger = EnhancedSSELogger("cv_extraction", workflow_id=job_id)
logger.start_phase(WorkflowPhase.PROCESSING)
logger.step("Extracting CV data...")
# ... your extraction code ...
logger.step_complete("Extraction complete!")
logger.end_phase()
""")

if __name__ == "__main__":
    asyncio.run(main())