#!/usr/bin/env python3
"""
Fix an existing portfolio using the validator
"""

from pathlib import Path
from services.portfolio.portfolio_validator import portfolio_validator

def fix_portfolio():
    portfolio_dir = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/portfolio_output")
    
    if not portfolio_dir.exists():
        print(f"❌ Portfolio directory not found: {portfolio_dir}")
        return
    
    print(f"🔧 Fixing portfolio at: {portfolio_dir}")
    
    # Run validator
    is_valid, errors, fixes = portfolio_validator.validate_and_fix_portfolio(portfolio_dir)
    
    # Print report
    report = portfolio_validator.generate_fix_report()
    print("\n" + report)
    
    if is_valid or fixes > 0:
        print("\n✅ Portfolio has been fixed! You can now run:")
        print(f"cd {portfolio_dir}")
        print("npm run dev")
    else:
        print("\n❌ Some errors could not be automatically fixed.")

if __name__ == "__main__":
    fix_portfolio()