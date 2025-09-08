#!/usr/bin/env python3
"""
Force re-extraction of CV files by clearing both cache and existing cv_data
"""

import sqlite3
import os
from datetime import datetime

# Database path
DB_PATHS = [
    'data/resume2website.db'  # Main database
]

def find_database():
    """Find the actual database file"""
    for path in DB_PATHS:
        if os.path.exists(path):
            return path
    return None

def force_reextraction_for_all():
    """Clear cache and reset cv_uploads to force re-extraction"""
    
    DB_PATH = find_database()
    if not DB_PATH:
        print(f"❌ Database not found")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print("=" * 60)
        print("FORCE CV RE-EXTRACTION")
        print("=" * 60)
        
        # 1. Clear extraction cache
        cursor.execute("SELECT COUNT(*) as count FROM cv_extraction_cache")
        cache_count = cursor.fetchone()[0]
        if cache_count > 0:
            cursor.execute("DELETE FROM cv_extraction_cache")
            print(f"✅ Cleared {cache_count} entries from extraction cache")
        else:
            print("ℹ️  Extraction cache already empty")
        
        # 2. Reset cv_uploads to force re-extraction
        cursor.execute("""
            SELECT COUNT(*) as count 
            FROM cv_uploads 
            WHERE status = 'completed' AND cv_data IS NOT NULL
        """)
        completed_count = cursor.fetchone()[0]
        
        if completed_count > 0:
            # Reset status and clear cv_data for completed uploads
            cursor.execute("""
                UPDATE cv_uploads 
                SET status = 'uploaded', cv_data = NULL 
                WHERE status = 'completed'
            """)
            print(f"✅ Reset {completed_count} completed CV uploads for re-extraction")
            
            # Show which files will be re-extracted
            cursor.execute("""
                SELECT job_id, filename, user_id 
                FROM cv_uploads 
                WHERE status = 'uploaded'
                LIMIT 5
            """)
            rows = cursor.fetchall()
            if rows:
                print("\n📝 Files ready for re-extraction:")
                for row in rows:
                    print(f"   - {row[1]} (job: {row[0][:8]}...)")
                    
                cursor.execute("SELECT COUNT(*) FROM cv_uploads WHERE status = 'uploaded'")
                total = cursor.fetchone()[0]
                if total > 5:
                    print(f"   ... and {total - 5} more")
        else:
            print("ℹ️  No completed CV uploads to reset")
        
        # Commit changes
        conn.commit()
        conn.close()
        
        print("\n✅ Re-extraction setup complete!")
        print("📝 Next time these files are accessed, they will be:")
        print("   1. Re-extracted with Claude 4 Opus")
        print("   2. Cached again if confidence > 0.75")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def force_reextraction_for_job(job_id: str):
    """Force re-extraction for a specific job"""
    
    DB_PATH = find_database()
    if not DB_PATH:
        print(f"❌ Database not found")
        return
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if job exists
        cursor.execute("SELECT filename, status FROM cv_uploads WHERE job_id = ?", (job_id,))
        result = cursor.fetchone()
        
        if not result:
            print(f"❌ Job {job_id} not found")
            return
            
        filename, status = result
        print(f"📁 Found job: {filename} (status: {status})")
        
        # Reset the job for re-extraction
        cursor.execute("""
            UPDATE cv_uploads 
            SET status = 'uploaded', cv_data = NULL 
            WHERE job_id = ?
        """, (job_id,))
        
        # Also remove from cache if exists
        cursor.execute("""
            DELETE FROM cv_extraction_cache 
            WHERE file_hash IN (
                SELECT file_hash FROM cv_uploads WHERE job_id = ?
            )
        """, (job_id,))
        
        conn.commit()
        conn.close()
        
        print(f"✅ Job {job_id} reset for re-extraction")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Force re-extraction for specific job
        job_id = sys.argv[1]
        force_reextraction_for_job(job_id)
    else:
        # Force re-extraction for all
        print("⚠️  This will reset ALL CV uploads for re-extraction!")
        print("   Files will be re-processed with Claude 4 Opus on next access")
        
        response = input("\nDo you want to continue? (yes/no): ").strip().lower()
        
        if response in ['yes', 'y']:
            force_reextraction_for_all()
        else:
            print("❌ Cancelled")
            
        print("=" * 60)