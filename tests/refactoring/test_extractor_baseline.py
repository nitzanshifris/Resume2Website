#!/usr/bin/env python3
"""
Test harness to establish baseline metrics for data_extractor.py refactoring.
This will help us ensure that our refactoring doesn't break functionality.
"""

import asyncio
import json
import time
import tracemalloc
from pathlib import Path
from typing import Dict, Any, List
import hashlib
from datetime import datetime
import random
import glob

# Add project root to path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


class ExtractorBaseline:
    """Create baseline metrics for CV extraction before refactoring."""
    
    def __init__(self, sample_size: int = 10):
        self.extractor = DataExtractor()
        self.results_dir = Path(__file__).parent / "baseline_results"
        self.results_dir.mkdir(exist_ok=True)
        self.sample_size = sample_size
        
        # Get all available CV files
        project_root = Path(__file__).parent.parent.parent
        cv_examples_dir = project_root / "data" / "cv_examples"
        
        all_files = []
        # PDFs
        all_files.extend(glob.glob(str(cv_examples_dir / "pdf_examples" / "pdf" / "*.pdf")))
        all_files.extend(glob.glob(str(cv_examples_dir / "pdf_examples" / "simple_pdf" / "*.pdf")))
        # Text files
        all_files.extend(glob.glob(str(cv_examples_dir / "text_examples" / "*.txt")))
        all_files.extend(glob.glob(str(cv_examples_dir / "text_examples" / "*.md")))
        # Markdown files
        all_files.extend(glob.glob(str(cv_examples_dir / "md_examples" / "*.md")))
        
        # Convert to relative paths from project root
        self.all_available_files = [
            str(Path(f).relative_to(project_root)) 
            for f in all_files if Path(f).exists()
        ]
        
        # Randomly sample files (or use all if less than sample_size)
        if len(self.all_available_files) <= sample_size:
            self.test_files = self.all_available_files
        else:
            random.seed(42)  # For reproducibility
            self.test_files = random.sample(self.all_available_files, sample_size)
        
        print(f"📚 Found {len(self.all_available_files)} CV files total")
        print(f"🎲 Testing {len(self.test_files)} randomly selected files")
    
    def _get_file_hash(self, filepath: str) -> str:
        """Get hash of file content for tracking."""
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()[:8]
    
    async def extract_with_metrics(self, filepath: str) -> Dict[str, Any]:
        """Extract CV data and collect metrics."""
        print(f"\n📄 Processing: {Path(filepath).name}")
        
        # Extract text from file
        print("  Extracting text...")
        raw_text = extract_text(filepath)
        
        if not raw_text:
            print(f"  ❌ Failed to extract text from {filepath}")
            return None
        
        print(f"  ✅ Extracted {len(raw_text)} characters")
        
        # Start metrics collection
        tracemalloc.start()
        start_time = time.time()
        start_memory = tracemalloc.get_traced_memory()[0]
        
        # Extract CV data
        print("  🚀 Starting CV extraction...")
        try:
            cv_data = await self.extractor.extract_cv_data(raw_text)
            extraction_success = True
            error_message = None
        except Exception as e:
            print(f"  ❌ Extraction failed: {e}")
            cv_data = None
            extraction_success = False
            error_message = str(e)
        
        # Collect metrics
        end_time = time.time()
        current_memory, peak_memory = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        
        # Calculate metrics
        extraction_time = end_time - start_time
        memory_used = (peak_memory - start_memory) / 1024 / 1024  # MB
        
        # Count extracted sections
        sections_extracted = 0
        section_details = {}
        
        if cv_data:
            cv_dict = cv_data.model_dump()
            for section_name, section_data in cv_dict.items():
                if section_data and not section_name.startswith('_'):
                    sections_extracted += 1
                    # Count items in each section
                    if isinstance(section_data, dict):
                        items_key = next((k for k in section_data.keys() if 'Items' in k), None)
                        if items_key and isinstance(section_data[items_key], list):
                            section_details[section_name] = len(section_data[items_key])
                        else:
                            section_details[section_name] = 1
                    else:
                        section_details[section_name] = 1
            
            # Calculate confidence
            confidence = self.extractor.calculate_extraction_confidence(cv_data, raw_text)
        else:
            confidence = 0.0
        
        metrics = {
            "file": Path(filepath).name,
            "file_hash": self._get_file_hash(filepath),
            "timestamp": datetime.now().isoformat(),
            "extraction_success": extraction_success,
            "error_message": error_message,
            "text_length": len(raw_text),
            "extraction_time_seconds": round(extraction_time, 2),
            "memory_used_mb": round(memory_used, 2),
            "sections_extracted": sections_extracted,
            "section_details": section_details,
            "confidence_score": round(confidence, 3),
            "total_sections_possible": len(self.extractor.section_schemas)
        }
        
        # Save results
        if cv_data:
            # Save extracted data
            data_file = self.results_dir / f"{Path(filepath).stem}_data.json"
            with open(data_file, 'w') as f:
                json.dump(cv_data.model_dump(), f, indent=2, default=str)
            metrics["data_file"] = str(data_file)
        
        print(f"  ⏱️  Time: {metrics['extraction_time_seconds']}s")
        print(f"  💾 Memory: {metrics['memory_used_mb']}MB")
        print(f"  📊 Sections: {metrics['sections_extracted']}/{metrics['total_sections_possible']}")
        print(f"  🎯 Confidence: {metrics['confidence_score']}")
        
        return metrics
    
    async def run_baseline_tests(self) -> List[Dict[str, Any]]:
        """Run extraction on all test files and collect metrics."""
        print("=" * 60)
        print("🧪 BASELINE METRICS COLLECTION")
        print("=" * 60)
        
        all_metrics = []
        project_root = Path(__file__).parent.parent.parent
        
        for filepath in self.test_files:
            full_path = project_root / filepath
            if not full_path.exists():
                print(f"⚠️  Skipping {filepath} - file not found")
                continue
            
            metrics = await self.extract_with_metrics(str(full_path))
            if metrics:
                all_metrics.append(metrics)
        
        # Save aggregated metrics
        metrics_file = self.results_dir / "baseline_metrics.json"
        with open(metrics_file, 'w') as f:
            json.dump(all_metrics, f, indent=2)
        
        print("\n" + "=" * 60)
        print("📈 BASELINE SUMMARY")
        print("=" * 60)
        
        if all_metrics:
            avg_time = sum(m['extraction_time_seconds'] for m in all_metrics) / len(all_metrics)
            avg_memory = sum(m['memory_used_mb'] for m in all_metrics) / len(all_metrics)
            avg_sections = sum(m['sections_extracted'] for m in all_metrics) / len(all_metrics)
            avg_confidence = sum(m['confidence_score'] for m in all_metrics) / len(all_metrics)
            
            print(f"Files tested: {len(all_metrics)}")
            print(f"Average extraction time: {avg_time:.2f}s")
            print(f"Average memory usage: {avg_memory:.2f}MB")
            print(f"Average sections extracted: {avg_sections:.1f}")
            print(f"Average confidence score: {avg_confidence:.3f}")
            print(f"\n✅ Baseline metrics saved to: {metrics_file}")
        
        return all_metrics
    
    def compare_with_baseline(self, new_metrics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compare new metrics with baseline to detect changes."""
        baseline_file = self.results_dir / "baseline_metrics.json"
        
        if not baseline_file.exists():
            print("⚠️  No baseline metrics found. Run baseline first.")
            return None
        
        with open(baseline_file, 'r') as f:
            baseline = json.load(f)
        
        comparison = {
            "changes_detected": [],
            "performance_changes": {},
            "quality_changes": {}
        }
        
        # Compare each file
        for new, base in zip(new_metrics, baseline):
            if new['file'] != base['file']:
                comparison["changes_detected"].append(f"File mismatch: {new['file']} vs {base['file']}")
                continue
            
            # Performance comparison
            time_diff = new['extraction_time_seconds'] - base['extraction_time_seconds']
            memory_diff = new['memory_used_mb'] - base['memory_used_mb']
            
            if abs(time_diff) > 0.5:  # More than 0.5s difference
                comparison["performance_changes"][new['file']] = {
                    "time_diff": time_diff,
                    "memory_diff": memory_diff
                }
            
            # Quality comparison
            sections_diff = new['sections_extracted'] - base['sections_extracted']
            confidence_diff = new['confidence_score'] - base['confidence_score']
            
            if sections_diff != 0 or abs(confidence_diff) > 0.05:
                comparison["quality_changes"][new['file']] = {
                    "sections_diff": sections_diff,
                    "confidence_diff": confidence_diff,
                    "sections_baseline": base['section_details'],
                    "sections_new": new['section_details']
                }
            
            # Check for data changes
            if 'data_file' in new and 'data_file' in base:
                with open(new['data_file'], 'r') as f:
                    new_data = json.load(f)
                with open(base['data_file'], 'r') as f:
                    base_data = json.load(f)
                
                # Simple comparison - could be more sophisticated
                if json.dumps(new_data, sort_keys=True) != json.dumps(base_data, sort_keys=True):
                    comparison["changes_detected"].append(f"Data changed for {new['file']}")
        
        return comparison


async def main():
    """Run baseline tests."""
    baseline = ExtractorBaseline()
    await baseline.run_baseline_tests()


if __name__ == "__main__":
    asyncio.run(main())