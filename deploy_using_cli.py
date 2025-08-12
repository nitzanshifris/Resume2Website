#!/usr/bin/env python3
"""
Deploy Portfolio using Vercel CLI
This bypasses the 10MB API limit by using the CLI
"""
import sys
import os
import json
import subprocess
import shutil
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.core.local.keychain_manager import KeychainManager

print("\n" + "="*70)
print("🚀 VERCEL CLI DEPLOYMENT (No Size Limits)")
print("="*70)

# Select portfolio
portfolio_path = "sandboxes/portfolios/07df66a9-3799-4035-9fc7-82f142151f9f_5940821a-8f8c-49c9-b526-3024bebf6841_0594991c"

if not os.path.exists(portfolio_path):
    portfolios_dir = "sandboxes/portfolios"
    portfolios = [d for d in os.listdir(portfolios_dir) 
                  if os.path.isdir(os.path.join(portfolios_dir, d))]
    if portfolios:
        portfolio_path = os.path.join(portfolios_dir, portfolios[0])

print(f"\n📁 Portfolio: {os.path.basename(portfolio_path)}")

# Step 1: Fix dependencies in the portfolio
print("\n1️⃣ Fixing dependencies...")

package_json_path = os.path.join(portfolio_path, "package.json")
with open(package_json_path, 'r') as f:
    package_data = json.load(f)

# Get original dependencies
deps = package_data.get("dependencies", {})
dev_deps = package_data.get("devDependencies", {})

# Move build dependencies to dependencies
build_deps = ["tailwindcss", "autoprefixer", "postcss", "typescript", 
              "@types/node", "@types/react", "@types/react-dom"]

for dep in build_deps:
    if dep in dev_deps and dep not in deps:
        deps[dep] = dev_deps[dep]
        print(f"   ✅ Moved {dep} to dependencies")

# Fix date-fns version
if "date-fns" in deps:
    deps["date-fns"] = "^3.6.0"
    print("   ✅ Fixed date-fns to ^3.6.0")

package_data["dependencies"] = deps

# Save fixed package.json
with open(package_json_path, 'w') as f:
    json.dump(package_data, f, indent=2)
print("   ✅ Updated package.json")

# Create .npmrc for legacy peer deps
npmrc_path = os.path.join(portfolio_path, ".npmrc")
with open(npmrc_path, 'w') as f:
    f.write("legacy-peer-deps=true\n")
print("   ✅ Created .npmrc")

# Step 2: Check if Vercel CLI is installed
print("\n2️⃣ Checking Vercel CLI...")

try:
    result = subprocess.run(['vercel', '--version'], capture_output=True, text=True)
    print(f"   ✅ Vercel CLI found: {result.stdout.strip()}")
except FileNotFoundError:
    print("   📦 Installing Vercel CLI...")
    subprocess.run(['npm', 'install', '-g', 'vercel'], check=True)
    print("   ✅ Vercel CLI installed")

# Step 3: Get token from keychain
print("\n3️⃣ Getting credentials...")

api_token = KeychainManager.get_credential('vercel_api_token')
team_id = KeychainManager.get_credential('vercel_team_id')

if not api_token:
    print("❌ No Vercel API token found!")
    print("   Run: python3 src/utils/setup_keychain.py")
    sys.exit(1)

print("   ✅ Token retrieved")
if team_id:
    print(f"   ✅ Team ID: {team_id}")

# Step 4: Deploy using Vercel CLI
print("\n4️⃣ Deploying with Vercel CLI...")
print("   This bypasses the 10MB API limit")
print("   Building and deploying...")

# Change to portfolio directory
original_dir = os.getcwd()
os.chdir(portfolio_path)

try:
    # Prepare environment
    env = os.environ.copy()
    env['VERCEL_TOKEN'] = api_token
    
    # Build deployment command
    cmd = [
        'vercel',
        '--yes',      # Skip prompts
        '--prod',     # Deploy to production
        '--token', api_token
    ]
    
    if team_id:
        cmd.extend(['--scope', team_id])
    
    print(f"\n   Running: {' '.join(cmd[:3])}...")
    
    # Run deployment
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        env=env
    )
    
    if result.returncode == 0:
        # Extract URL from output
        output_lines = result.stdout.strip().split('\n')
        deployment_url = None
        
        for line in output_lines:
            if line.startswith('https://'):
                deployment_url = line.strip()
                break
        
        if deployment_url:
            print("\n" + "="*70)
            print("🎉 DEPLOYMENT SUCCESSFUL!")
            print("="*70)
            print(f"\n🌐 YOUR PORTFOLIO IS LIVE AT:")
            print(f"   {deployment_url}")
            print("\n✨ The site is building on Vercel's servers")
            print("   It will be ready in 2-3 minutes")
            
            # Save URL
            url_file = os.path.join(original_dir, "deployed_portfolio_url.txt")
            with open(url_file, "w") as f:
                f.write(deployment_url)
            print(f"\n💾 URL saved to: deployed_portfolio_url.txt")
        else:
            print("\n✅ Deployment initiated!")
            print("   Check your Vercel dashboard for the URL")
            print(f"\n📊 Output:\n{result.stdout}")
    else:
        print(f"\n❌ Deployment failed!")
        print(f"Error: {result.stderr}")
        print(f"Output: {result.stdout}")
        
finally:
    # Return to original directory
    os.chdir(original_dir)

print("\n" + "="*70)
print("📌 NOTES:")
print("   - Vercel CLI handles large projects without size limits")
print("   - The build happens on Vercel's servers")
print("   - No 10MB API restriction with CLI deployment")
print("="*70)