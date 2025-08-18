#!/usr/bin/env python3
"""
Comprehensive test of CV extraction on all PNG/JPG files.
Compares original data_extractor.py vs any changes made.
"""

import asyncio
import json
import time
import glob
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import hashlib

# Add project root to path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


class PNGExtractionTester:
    """Test CV extraction on PNG/JPG files and generate comprehensive report."""
    
    def __init__(self):
        self.extractor = DataExtractor()
        self.results_dir = Path(__file__).parent / "png_test_results"
        self.results_dir.mkdir(exist_ok=True)
        
        # Get all PNG and JPG files
        self.project_root = Path(__file__).parent.parent.parent
        png_dir = self.project_root / "data" / "cv_examples" / "png_examples"
        
        # Collect all image files
        self.test_files = []
        self.test_files.extend(glob.glob(str(png_dir / "*.png")))
        self.test_files.extend(glob.glob(str(png_dir / "*.jpg")))
        self.test_files.extend(glob.glob(str(png_dir / "**" / "*.png"), recursive=True))
        self.test_files.extend(glob.glob(str(png_dir / "**" / "*.jpg"), recursive=True))
        
        # Remove duplicates and sort
        self.test_files = sorted(list(set(self.test_files)))
        
        print(f"📸 Found {len(self.test_files)} PNG/JPG files to test")
    
    def _get_file_info(self, filepath: str) -> Dict[str, Any]:
        """Get file information."""
        path = Path(filepath)
        relative_path = path.relative_to(self.project_root)
        
        # Get file hash
        with open(filepath, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()[:8]
        
        return {
            "filename": path.name,
            "relative_path": str(relative_path),
            "file_hash": file_hash,
            "size_kb": path.stat().st_size / 1024
        }
    
    async def extract_single_file(self, filepath: str) -> Dict[str, Any]:
        """Extract CV data from a single file and collect metrics."""
        file_info = self._get_file_info(filepath)
        result = {
            "file": file_info,
            "timestamp": datetime.now().isoformat(),
            "extraction": {}
        }
        
        print(f"\n{'='*60}")
        print(f"📄 Processing: {file_info['filename']}")
        print(f"   Path: {file_info['relative_path']}")
        print(f"   Size: {file_info['size_kb']:.1f} KB")
        
        # Extract text
        print("   🔍 Extracting text...")
        start_time = time.time()
        
        try:
            raw_text = extract_text(filepath)
            text_extraction_time = time.time() - start_time
            
            if not raw_text:
                result["extraction"]["status"] = "failed"
                result["extraction"]["error"] = "No text extracted"
                result["extraction"]["text_length"] = 0
                print("   ❌ Failed to extract text")
                return result
            
            print(f"   ✅ Extracted {len(raw_text)} characters in {text_extraction_time:.2f}s")
            result["extraction"]["text_extraction_time"] = round(text_extraction_time, 2)
            result["extraction"]["text_length"] = len(raw_text)
            result["extraction"]["text_preview"] = raw_text[:200] + "..." if len(raw_text) > 200 else raw_text
            
        except Exception as e:
            result["extraction"]["status"] = "error"
            result["extraction"]["error"] = str(e)
            print(f"   ❌ Text extraction error: {e}")
            return result
        
        # Extract CV data
        print("   🚀 Extracting CV data...")
        cv_start_time = time.time()
        
        try:
            cv_data = await self.extractor.extract_cv_data(raw_text)
            cv_extraction_time = time.time() - cv_start_time
            
            result["extraction"]["status"] = "success"
            result["extraction"]["cv_extraction_time"] = round(cv_extraction_time, 2)
            result["extraction"]["total_time"] = round(text_extraction_time + cv_extraction_time, 2)
            
            # Analyze extracted data
            cv_dict = cv_data.model_dump()
            
            # Count sections
            sections_found = {}
            for section_name, section_data in cv_dict.items():
                if section_data and not section_name.startswith('_'):
                    sections_found[section_name] = self._analyze_section(section_name, section_data)
            
            result["extraction"]["sections_found"] = sections_found
            result["extraction"]["sections_count"] = len(sections_found)
            result["extraction"]["total_sections_possible"] = len(self.extractor.section_schemas)
            result["extraction"]["extraction_rate"] = round(
                len(sections_found) / len(self.extractor.section_schemas) * 100, 1
            )
            
            # Calculate confidence
            confidence = self.extractor.calculate_extraction_confidence(cv_data, raw_text)
            result["extraction"]["confidence_score"] = round(confidence, 3)
            
            # Save full CV data
            cv_data_file = self.results_dir / f"{Path(filepath).stem}_cv_data.json"
            with open(cv_data_file, 'w') as f:
                json.dump(cv_dict, f, indent=2, default=str)
            result["extraction"]["cv_data_file"] = str(cv_data_file.relative_to(self.project_root))
            
            print(f"   ✅ Extracted {len(sections_found)} sections in {cv_extraction_time:.2f}s")
            print(f"   📊 Extraction rate: {result['extraction']['extraction_rate']}%")
            print(f"   🎯 Confidence: {confidence:.3f}")
            
        except Exception as e:
            result["extraction"]["status"] = "error"
            result["extraction"]["error"] = str(e)
            result["extraction"]["cv_extraction_time"] = round(time.time() - cv_start_time, 2)
            print(f"   ❌ CV extraction error: {e}")
        
        return result
    
    def _analyze_section(self, section_name: str, section_data: Any) -> Dict[str, Any]:
        """Analyze a section's content."""
        analysis = {
            "found": True,
            "type": type(section_data).__name__
        }
        
        if isinstance(section_data, dict):
            # Count items if it has an items field
            items_key = next((k for k in section_data.keys() if 'Items' in k or 'items' in k), None)
            if items_key and isinstance(section_data[items_key], list):
                analysis["items_count"] = len(section_data[items_key])
            else:
                analysis["fields_count"] = len([k for k in section_data.keys() if not k.startswith('_')])
        elif isinstance(section_data, list):
            analysis["items_count"] = len(section_data)
        
        return analysis
    
    async def run_all_tests(self) -> List[Dict[str, Any]]:
        """Run extraction on all PNG/JPG files."""
        all_results = []
        
        print("\n" + "="*60)
        print("🧪 COMPREHENSIVE PNG/JPG EXTRACTION TEST")
        print("="*60)
        print(f"Testing {len(self.test_files)} files...")
        
        for i, filepath in enumerate(self.test_files, 1):
            print(f"\n[{i}/{len(self.test_files)}]", end="")
            result = await self.extract_single_file(filepath)
            all_results.append(result)
            
            # Small delay to avoid rate limiting
            if i < len(self.test_files):
                await asyncio.sleep(1)
        
        return all_results
    
    def generate_markdown_report(self, results: List[Dict[str, Any]]) -> str:
        """Generate comprehensive markdown report."""
        report = []
        
        # Header
        report.append("# CV Extraction Results - PNG/JPG Files")
        report.append(f"\n**Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Total Files Tested**: {len(results)}")
        report.append(f"**Extractor Version**: Original (before refactoring)")
        report.append("\n---\n")
        
        # Summary Statistics
        report.append("## Summary Statistics\n")
        
        successful = [r for r in results if r['extraction'].get('status') == 'success']
        failed = [r for r in results if r['extraction'].get('status') != 'success']
        
        report.append(f"- **Successful Extractions**: {len(successful)} ({len(successful)/len(results)*100:.1f}%)")
        report.append(f"- **Failed Extractions**: {len(failed)} ({len(failed)/len(results)*100:.1f}%)")
        
        if successful:
            avg_time = sum(r['extraction']['total_time'] for r in successful) / len(successful)
            avg_sections = sum(r['extraction']['sections_count'] for r in successful) / len(successful)
            avg_confidence = sum(r['extraction']['confidence_score'] for r in successful) / len(successful)
            avg_text_len = sum(r['extraction']['text_length'] for r in successful) / len(successful)
            
            report.append(f"\n### Performance Metrics")
            report.append(f"- **Average Total Time**: {avg_time:.2f} seconds")
            report.append(f"- **Average Text Length**: {avg_text_len:.0f} characters")
            report.append(f"- **Average Sections Extracted**: {avg_sections:.1f} out of 17")
            report.append(f"- **Average Confidence Score**: {avg_confidence:.3f}")
        
        # Section extraction statistics
        if successful:
            report.append(f"\n### Section Extraction Frequency")
            section_counts = {}
            for r in successful:
                for section in r['extraction']['sections_found'].keys():
                    section_counts[section] = section_counts.get(section, 0) + 1
            
            report.append("| Section | Files Found In | Percentage |")
            report.append("|---------|---------------|------------|")
            for section, count in sorted(section_counts.items(), key=lambda x: x[1], reverse=True):
                pct = count / len(successful) * 100
                report.append(f"| {section} | {count} | {pct:.1f}% |")
        
        report.append("\n---\n")
        
        # Detailed Results
        report.append("## Detailed Results by File\n")
        
        for i, result in enumerate(results, 1):
            file_info = result['file']
            extraction = result['extraction']
            
            report.append(f"### {i}. {file_info['filename']}\n")
            report.append(f"**Path**: `{file_info['relative_path']}`")
            report.append(f"**Size**: {file_info['size_kb']:.1f} KB")
            report.append(f"**Hash**: {file_info['file_hash']}")
            report.append(f"**Status**: {extraction.get('status', 'unknown').upper()}")
            
            if extraction.get('status') == 'success':
                report.append(f"\n**Extraction Metrics**:")
                report.append(f"- Text extracted: {extraction['text_length']} characters")
                report.append(f"- Time taken: {extraction['total_time']:.2f}s (text: {extraction['text_extraction_time']:.2f}s, CV: {extraction['cv_extraction_time']:.2f}s)")
                report.append(f"- Sections found: {extraction['sections_count']}/{extraction['total_sections_possible']} ({extraction['extraction_rate']}%)")
                report.append(f"- Confidence score: {extraction['confidence_score']}")
                
                if extraction['sections_found']:
                    report.append(f"\n**Sections Extracted**:")
                    for section, details in extraction['sections_found'].items():
                        items_info = ""
                        if 'items_count' in details:
                            items_info = f" ({details['items_count']} items)"
                        elif 'fields_count' in details:
                            items_info = f" ({details['fields_count']} fields)"
                        report.append(f"- ✅ {section}{items_info}")
                
                if extraction.get('text_preview'):
                    report.append(f"\n**Text Preview**:")
                    report.append("```")
                    report.append(extraction['text_preview'])
                    report.append("```")
            else:
                error = extraction.get('error', 'Unknown error')
                report.append(f"\n**Error**: {error}")
            
            report.append("\n---\n")
        
        # Failed Files Summary
        if failed:
            report.append("## Failed Extractions Summary\n")
            report.append("| File | Error |")
            report.append("|------|-------|")
            for r in failed:
                filename = r['file']['filename']
                error = r['extraction'].get('error', 'Unknown')
                report.append(f"| {filename} | {error} |")
        
        return "\n".join(report)
    
    async def run_and_save_report(self):
        """Run tests and save markdown report."""
        results = await self.run_all_tests()
        
        # Generate markdown report
        report = self.generate_markdown_report(results)
        
        # Save report
        report_file = self.results_dir / f"png_extraction_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w') as f:
            f.write(report)
        
        # Save raw results
        results_file = self.results_dir / f"png_extraction_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        print("\n" + "="*60)
        print("✅ TEST COMPLETE")
        print("="*60)
        print(f"📄 Markdown report: {report_file.relative_to(self.project_root)}")
        print(f"📊 Raw results: {results_file.relative_to(self.project_root)}")
        
        return str(report_file)


async def main():
    """Run the PNG extraction test."""
    tester = PNGExtractionTester()
    report_file = await tester.run_and_save_report()
    print(f"\n✅ Report generated: {report_file}")


if __name__ == "__main__":
    asyncio.run(main())