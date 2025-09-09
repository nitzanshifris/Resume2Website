#!/usr/bin/env python3
"""Quick baseline test with just 3 files."""

import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from test_extractor_baseline import ExtractorBaseline

async def main():
    # Run with just 3 files for quick testing
    baseline = ExtractorBaseline(sample_size=3)
    await baseline.run_baseline_tests()

if __name__ == "__main__":
    asyncio.run(main())