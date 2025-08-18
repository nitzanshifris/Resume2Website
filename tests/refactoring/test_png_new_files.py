#!/usr/bin/env python3
"""
Test CV extraction specifically on files in png_new directory.
Generate comprehensive before/after comparison report.
"""

import asyncio
import json
import time
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime
import hashlib

# Add project root to path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


class PNGNewTester:
    """Test CV extraction on png_new directory files."""
    
    def __init__(self):
        self.extractor = DataExtractor()
        self.results_dir = Path(__file__).parent / "png_new_results"
        self.results_dir.mkdir(exist_ok=True)
        
        # Get files from png_new directory
        self.project_root = Path(__file__).parent.parent.parent
        png_new_dir = self.project_root / "data" / "cv_examples" / "png_examples" / "png_new"
        
        # Get all PNG files in png_new
        self.test_files = sorted(list(png_new_dir.glob("*.png")))
        
        print(f"📸 Found {len(self.test_files)} PNG files in png_new directory")
        for f in self.test_files:
            print(f"   - {f.name}")
    
    def _get_file_info(self, filepath: Path) -> Dict[str, Any]:
        """Get file information."""
        relative_path = filepath.relative_to(self.project_root)
        
        # Get file hash
        with open(filepath, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()[:8]
        
        return {
            "filename": filepath.name,
            "relative_path": str(relative_path),
            "file_hash": file_hash,
            "size_kb": round(filepath.stat().st_size / 1024, 1)
        }
    
    async def extract_single_file(self, filepath: Path) -> Dict[str, Any]:
        """Extract CV data from a single file with detailed metrics."""
        file_info = self._get_file_info(filepath)
        result = {
            "file": file_info,
            "timestamp": datetime.now().isoformat(),
            "extraction": {}
        }
        
        print(f"\n{'='*60}")
        print(f"📄 Processing: {file_info['filename']}")
        print(f"   Size: {file_info['size_kb']} KB")
        
        # Extract text
        print("   🔍 Extracting text from image...")
        start_time = time.time()
        
        try:
            raw_text = extract_text(str(filepath))
            text_extraction_time = time.time() - start_time
            
            if not raw_text:
                result["extraction"]["status"] = "failed"
                result["extraction"]["error"] = "No text extracted from image"
                result["extraction"]["text_length"] = 0
                print("   ❌ Failed to extract text from image")
                return result
            
            print(f"   ✅ Extracted {len(raw_text)} characters in {text_extraction_time:.2f}s")
            result["extraction"]["text_extraction_time"] = round(text_extraction_time, 2)
            result["extraction"]["text_length"] = len(raw_text)
            result["extraction"]["text_preview"] = raw_text[:300] + "..." if len(raw_text) > 300 else raw_text
            
        except Exception as e:
            result["extraction"]["status"] = "error"
            result["extraction"]["error"] = f"Text extraction error: {str(e)}"
            print(f"   ❌ Text extraction error: {e}")
            return result
        
        # Extract CV data
        print("   🚀 Extracting structured CV data...")
        cv_start_time = time.time()
        
        try:
            cv_data = await self.extractor.extract_cv_data(raw_text)
            cv_extraction_time = time.time() - cv_start_time
            
            result["extraction"]["status"] = "success"
            result["extraction"]["cv_extraction_time"] = round(cv_extraction_time, 2)
            result["extraction"]["total_time"] = round(text_extraction_time + cv_extraction_time, 2)
            
            # Analyze extracted data
            cv_dict = cv_data.model_dump()
            
            # Detailed section analysis
            sections_analysis = {}
            for section_name in self.extractor.section_schemas.keys():
                section_data = cv_dict.get(section_name)
                if section_data and not section_name.startswith('_'):
                    sections_analysis[section_name] = self._analyze_section_detail(section_name, section_data)
                else:
                    sections_analysis[section_name] = {"found": False}
            
            result["extraction"]["sections_analysis"] = sections_analysis
            result["extraction"]["sections_found"] = [s for s, d in sections_analysis.items() if d["found"]]
            result["extraction"]["sections_missing"] = [s for s, d in sections_analysis.items() if not d["found"]]
            result["extraction"]["sections_count"] = len(result["extraction"]["sections_found"])
            result["extraction"]["total_sections_possible"] = len(self.extractor.section_schemas)
            result["extraction"]["extraction_rate"] = round(
                len(result["extraction"]["sections_found"]) / len(self.extractor.section_schemas) * 100, 1
            )
            
            # Calculate confidence
            confidence = self.extractor.calculate_extraction_confidence(cv_data, raw_text)
            result["extraction"]["confidence_score"] = round(confidence, 3)
            
            # Extract key information
            key_info = self._extract_key_info(cv_dict)
            result["extraction"]["key_info"] = key_info
            
            # Save full CV data
            cv_data_file = self.results_dir / f"{filepath.stem}_cv_data.json"
            with open(cv_data_file, 'w') as f:
                json.dump(cv_dict, f, indent=2, default=str)
            result["extraction"]["cv_data_file"] = str(cv_data_file.name)
            
            print(f"   ✅ Extracted {len(result['extraction']['sections_found'])} sections in {cv_extraction_time:.2f}s")
            print(f"   📊 Extraction rate: {result['extraction']['extraction_rate']}%")
            print(f"   🎯 Confidence: {confidence:.3f}")
            
            # Print sections found
            if result["extraction"]["sections_found"]:
                print(f"   ✅ Sections found: {', '.join(result['extraction']['sections_found'])}")
            if result["extraction"]["sections_missing"]:
                print(f"   ❌ Sections missing: {', '.join(result['extraction']['sections_missing'])}")
            
        except Exception as e:
            result["extraction"]["status"] = "error"
            result["extraction"]["error"] = f"CV extraction error: {str(e)}"
            result["extraction"]["cv_extraction_time"] = round(time.time() - cv_start_time, 2)
            print(f"   ❌ CV extraction error: {e}")
        
        return result
    
    def _analyze_section_detail(self, section_name: str, section_data: Any) -> Dict[str, Any]:
        """Detailed analysis of a section's content."""
        analysis = {
            "found": True,
            "type": type(section_data).__name__
        }
        
        if isinstance(section_data, dict):
            # Special handling for different sections
            if section_name == "hero":
                analysis["name"] = section_data.get("fullName", "Not found")
                analysis["title"] = section_data.get("professionalTitle", "Not found")
            elif section_name == "contact":
                analysis["email"] = section_data.get("email", "Not found")
                analysis["phone"] = section_data.get("phone", "Not found")
                analysis["location"] = section_data.get("location", {})
            elif section_name == "experience":
                items = section_data.get("experienceItems", [])
                analysis["items_count"] = len(items)
                if items:
                    analysis["companies"] = [item.get("company", "") for item in items if item.get("company")]
                    analysis["job_titles"] = [item.get("jobTitle", "") for item in items if item.get("jobTitle")]
            elif section_name == "education":
                items = section_data.get("educationItems", [])
                analysis["items_count"] = len(items)
                if items:
                    analysis["institutions"] = [item.get("institution", "") for item in items if item.get("institution")]
                    analysis["degrees"] = [item.get("degree", "") for item in items if item.get("degree")]
            elif section_name == "skills":
                categories = section_data.get("skillCategories", [])
                ungrouped = section_data.get("ungroupedSkills", [])
                analysis["categories_count"] = len(categories)
                analysis["ungrouped_count"] = len(ungrouped)
                analysis["total_skills"] = sum(len(cat.get("skills", [])) for cat in categories) + len(ungrouped)
            else:
                # Generic handling for other sections
                items_key = next((k for k in section_data.keys() if 'Items' in k or 'items' in k), None)
                if items_key and isinstance(section_data[items_key], list):
                    analysis["items_count"] = len(section_data[items_key])
                else:
                    analysis["fields_count"] = len([k for k in section_data.keys() if not k.startswith('_')])
        elif isinstance(section_data, list):
            analysis["items_count"] = len(section_data)
        
        return analysis
    
    def _extract_key_info(self, cv_dict: Dict) -> Dict[str, Any]:
        """Extract key information from CV data."""
        key_info = {}
        
        # Hero section
        if cv_dict.get("hero"):
            key_info["name"] = cv_dict["hero"].get("fullName", "Unknown")
            key_info["title"] = cv_dict["hero"].get("professionalTitle", "Unknown")
        else:
            key_info["name"] = "Not extracted"
            key_info["title"] = "Not extracted"
        
        # Contact
        if cv_dict.get("contact"):
            key_info["email"] = cv_dict["contact"].get("email", "Not found")
            key_info["phone"] = cv_dict["contact"].get("phone", "Not found")
            if cv_dict["contact"].get("location"):
                loc = cv_dict["contact"]["location"]
                key_info["location"] = f"{loc.get('city', '')}, {loc.get('state', '')}, {loc.get('country', '')}".strip(", ")
        
        # Experience
        if cv_dict.get("experience") and cv_dict["experience"].get("experienceItems"):
            exp_items = cv_dict["experience"]["experienceItems"]
            key_info["experience_count"] = len(exp_items)
            if exp_items:
                key_info["current_company"] = exp_items[0].get("company", "Unknown")
                key_info["current_role"] = exp_items[0].get("jobTitle", "Unknown")
        
        # Education
        if cv_dict.get("education") and cv_dict["education"].get("educationItems"):
            edu_items = cv_dict["education"]["educationItems"]
            key_info["education_count"] = len(edu_items)
            if edu_items:
                key_info["highest_degree"] = edu_items[0].get("degree", "Unknown")
                key_info["institution"] = edu_items[0].get("institution", "Unknown")
        
        return key_info
    
    async def run_all_tests(self) -> List[Dict[str, Any]]:
        """Run extraction on all PNG files in png_new."""
        all_results = []
        
        print("\n" + "="*60)
        print("🧪 PNG_NEW DIRECTORY EXTRACTION TEST")
        print("="*60)
        print(f"Testing {len(self.test_files)} files...")
        
        for i, filepath in enumerate(self.test_files, 1):
            print(f"\n[{i}/{len(self.test_files)}]", end="")
            result = await self.extract_single_file(filepath)
            all_results.append(result)
            
            # Small delay to avoid rate limiting
            if i < len(self.test_files):
                await asyncio.sleep(0.5)
        
        return all_results
    
    def generate_markdown_report(self, results: List[Dict[str, Any]]) -> str:
        """Generate comprehensive markdown report."""
        report = []
        
        # Header
        report.append("# CV Extraction Results - PNG_NEW Directory")
        report.append(f"\n**Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Total Files Tested**: {len(results)}")
        report.append(f"**Directory**: `data/cv_examples/png_examples/png_new/`")
        report.append(f"**Extractor State**: Current (with extraction_config.py added)")
        report.append("\n---\n")
        
        # Summary Statistics
        report.append("## 📊 Summary Statistics\n")
        
        successful = [r for r in results if r['extraction'].get('status') == 'success']
        failed = [r for r in results if r['extraction'].get('status') != 'success']
        
        report.append(f"- **Successful Extractions**: {len(successful)}/{len(results)} ({len(successful)/len(results)*100:.1f}%)")
        report.append(f"- **Failed Extractions**: {len(failed)}/{len(results)} ({len(failed)/len(results)*100:.1f}%)")
        
        if successful:
            # Performance metrics
            avg_time = sum(r['extraction']['total_time'] for r in successful) / len(successful)
            avg_text_time = sum(r['extraction']['text_extraction_time'] for r in successful) / len(successful)
            avg_cv_time = sum(r['extraction']['cv_extraction_time'] for r in successful) / len(successful)
            avg_sections = sum(r['extraction']['sections_count'] for r in successful) / len(successful)
            avg_confidence = sum(r['extraction']['confidence_score'] for r in successful) / len(successful)
            avg_text_len = sum(r['extraction']['text_length'] for r in successful) / len(successful)
            avg_extraction_rate = sum(r['extraction']['extraction_rate'] for r in successful) / len(successful)
            
            report.append(f"\n### ⚡ Performance Metrics")
            report.append(f"- **Average Total Time**: {avg_time:.2f}s")
            report.append(f"  - Text Extraction: {avg_text_time:.2f}s")
            report.append(f"  - CV Extraction: {avg_cv_time:.2f}s")
            report.append(f"- **Average Text Length**: {avg_text_len:.0f} characters")
            report.append(f"- **Average Sections Extracted**: {avg_sections:.1f}/17 ({avg_extraction_rate:.1f}%)")
            report.append(f"- **Average Confidence Score**: {avg_confidence:.3f}")
        
        # Section extraction frequency
        if successful:
            report.append(f"\n### 📋 Section Extraction Frequency")
            report.append("\n| Section | Found In | Success Rate | Avg Items/Fields |")
            report.append("|---------|----------|--------------|------------------|")
            
            section_stats = {}
            for section_name in self.test_files[0].parent.parent.parent.parent.parent / "src/core/cv_extraction/data_extractor.py":
                # Initialize stats for all sections
                pass
            
            # Get all possible sections from first result
            if results and results[0]['extraction'].get('sections_analysis'):
                all_sections = results[0]['extraction']['sections_analysis'].keys()
                
                for section in all_sections:
                    found_count = 0
                    item_counts = []
                    
                    for r in successful:
                        section_data = r['extraction']['sections_analysis'].get(section, {})
                        if section_data.get('found'):
                            found_count += 1
                            if 'items_count' in section_data:
                                item_counts.append(section_data['items_count'])
                            elif 'fields_count' in section_data:
                                item_counts.append(section_data['fields_count'])
                    
                    success_rate = found_count / len(successful) * 100 if successful else 0
                    avg_items = sum(item_counts) / len(item_counts) if item_counts else 0
                    
                    # Emoji based on success rate
                    emoji = "✅" if success_rate >= 80 else "⚠️" if success_rate >= 50 else "❌"
                    
                    report.append(f"| {emoji} {section} | {found_count}/{len(successful)} | {success_rate:.1f}% | {avg_items:.1f} |")
        
        report.append("\n---\n")
        
        # Detailed Results
        report.append("## 📄 Detailed Results by File\n")
        
        for i, result in enumerate(results, 1):
            file_info = result['file']
            extraction = result['extraction']
            
            # Status emoji
            status_emoji = "✅" if extraction.get('status') == 'success' else "❌"
            
            report.append(f"### {i}. {status_emoji} {file_info['filename']}\n")
            report.append(f"**File Info**:")
            report.append(f"- Size: {file_info['size_kb']} KB")
            report.append(f"- Hash: `{file_info['file_hash']}`")
            
            if extraction.get('status') == 'success':
                report.append(f"\n**Extraction Results**:")
                report.append(f"- Status: ✅ SUCCESS")
                report.append(f"- Text Extracted: {extraction['text_length']} characters")
                report.append(f"- Time: {extraction['total_time']:.2f}s (OCR: {extraction['text_extraction_time']:.2f}s, CV: {extraction['cv_extraction_time']:.2f}s)")
                report.append(f"- Sections: {extraction['sections_count']}/{extraction['total_sections_possible']} ({extraction['extraction_rate']}%)")
                report.append(f"- Confidence: {extraction['confidence_score']}")
                
                # Key information
                if extraction.get('key_info'):
                    report.append(f"\n**Key Information Extracted**:")
                    info = extraction['key_info']
                    if info.get('name') != 'Not extracted':
                        report.append(f"- Name: **{info.get('name', 'Unknown')}**")
                    if info.get('title') != 'Not extracted':
                        report.append(f"- Title: {info.get('title', 'Unknown')}")
                    if info.get('email'):
                        report.append(f"- Email: {info.get('email', 'Not found')}")
                    if info.get('current_company'):
                        report.append(f"- Current Role: {info.get('current_role', '')} at {info.get('current_company', '')}")
                    if info.get('highest_degree'):
                        report.append(f"- Education: {info.get('highest_degree', '')} from {info.get('institution', '')}")
                
                # Sections breakdown
                if extraction.get('sections_found'):
                    report.append(f"\n**Sections Found** ({len(extraction['sections_found'])}):")
                    for section in extraction['sections_found']:
                        section_detail = extraction['sections_analysis'].get(section, {})
                        detail_str = ""
                        if 'items_count' in section_detail:
                            detail_str = f" - {section_detail['items_count']} items"
                        elif 'fields_count' in section_detail:
                            detail_str = f" - {section_detail['fields_count']} fields"
                        report.append(f"- ✅ `{section}`{detail_str}")
                
                if extraction.get('sections_missing'):
                    report.append(f"\n**Sections Missing** ({len(extraction['sections_missing'])}):")
                    for section in extraction['sections_missing'][:5]:  # Show first 5
                        report.append(f"- ❌ `{section}`")
                    if len(extraction['sections_missing']) > 5:
                        report.append(f"- ... and {len(extraction['sections_missing']) - 5} more")
                
                # Text preview
                if extraction.get('text_preview'):
                    report.append(f"\n<details>")
                    report.append(f"<summary>Text Preview (first 300 chars)</summary>\n")
                    report.append("```")
                    report.append(extraction['text_preview'])
                    report.append("```")
                    report.append(f"</details>")
                    
            else:
                report.append(f"\n**Status**: ❌ FAILED")
                error = extraction.get('error', 'Unknown error')
                report.append(f"**Error**: {error}")
            
            report.append("\n---\n")
        
        # Summary Table
        report.append("## 📈 Summary Table\n")
        report.append("| File | Status | Sections | Confidence | Time | Name Extracted |")
        report.append("|------|--------|----------|------------|------|----------------|")
        
        for r in results:
            file = r['file']['filename']
            ext = r['extraction']
            
            if ext.get('status') == 'success':
                status = "✅"
                sections = f"{ext['sections_count']}/17"
                confidence = f"{ext['confidence_score']:.2f}"
                time = f"{ext['total_time']:.1f}s"
                name = ext.get('key_info', {}).get('name', 'No')
                if name not in ['No', 'Not extracted', 'Unknown']:
                    name = f"✅ {name}"
                else:
                    name = "❌"
            else:
                status = "❌"
                sections = "-"
                confidence = "-"
                time = "-"
                name = "-"
            
            report.append(f"| {file} | {status} | {sections} | {confidence} | {time} | {name} |")
        
        # Failed files details
        if failed:
            report.append(f"\n## ❌ Failed Extractions Details\n")
            for r in failed:
                report.append(f"- **{r['file']['filename']}**: {r['extraction'].get('error', 'Unknown error')}")
        
        # Footer
        report.append(f"\n---")
        report.append(f"\n*Report generated on {datetime.now().strftime('%Y-%m-%d at %H:%M:%S')}*")
        
        return "\n".join(report)
    
    async def run_and_save_report(self):
        """Run tests and save markdown report."""
        results = await self.run_all_tests()
        
        # Generate markdown report
        report = self.generate_markdown_report(results)
        
        # Save report with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = self.results_dir / f"png_new_extraction_report_{timestamp}.md"
        with open(report_file, 'w') as f:
            f.write(report)
        
        # Also save as latest for easy access
        latest_report = self.results_dir / "png_new_extraction_report_LATEST.md"
        with open(latest_report, 'w') as f:
            f.write(report)
        
        # Save raw results
        results_file = self.results_dir / f"png_new_extraction_results_{timestamp}.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        print("\n" + "="*60)
        print("✅ TEST COMPLETE")
        print("="*60)
        print(f"📄 Markdown report: {report_file.relative_to(self.project_root)}")
        print(f"📄 Latest report: {latest_report.relative_to(self.project_root)}")
        print(f"📊 Raw results: {results_file.relative_to(self.project_root)}")
        
        return str(report_file)


async def main():
    """Run the PNG extraction test."""
    tester = PNGNewTester()
    report_file = await tester.run_and_save_report()
    print(f"\n✅ Full report generated: {report_file}")


if __name__ == "__main__":
    asyncio.run(main())