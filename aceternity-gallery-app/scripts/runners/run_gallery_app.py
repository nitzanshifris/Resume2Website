#!/usr/bin/env python3
import subprocess
import os
import sys
import time

def run_gallery():
    """Run the component gallery Next.js application"""
    
    # Path to the template directory
    template_dir = os.path.abspath("../apps/backend/templates/cv2web-react-template")
    
    print("🚀 Starting Component Gallery Application...")
    print(f"📁 Directory: {template_dir}")
    print("-" * 50)
    
    # Check if directory exists
    if not os.path.exists(template_dir):
        print("❌ Error: Template directory not found!")
        return
    
    # Check if node_modules exists
    node_modules = os.path.join(template_dir, "node_modules")
    if not os.path.exists(node_modules):
        print("📦 Installing dependencies...")
        subprocess.run(["npm", "install"], cwd=template_dir)
    
    print("\n🔧 Starting Next.js development server on port 6001...")
    print("⏳ Please wait for the server to start...\n")
    
    try:
        # Run the development server
        process = subprocess.Popen(
            ["npm", "run", "dev", "--", "--port", "6001"],
            cwd=template_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            bufsize=1
        )
        
        print("✅ Server starting... Press Ctrl+C to stop\n")
        print("🌐 Component Gallery URLs:")
        print("   - Main Gallery: http://localhost:6001/components-gallery")
        print("   - 3D Card Demo: http://localhost:6001/components-gallery/3d-card")
        print("\n" + "=" * 50 + "\n")
        
        # Stream output
        while True:
            output = process.stdout.readline()
            if output:
                print(output.strip())
            
            # Check if process is still running
            if process.poll() is not None:
                break
                
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping server...")
        process.terminate()
        process.wait()
        print("✅ Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    run_gallery()