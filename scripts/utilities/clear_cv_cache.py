#!/usr/bin/env python3
"""
Clear CV extraction cache to force re-extraction of all files
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

DB_PATH = find_database()

def clear_cv_extraction_cache():
    """Clear all cached CV extractions from the database"""
    
    if not DB_PATH or not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get current cache stats before clearing
        cursor.execute("SELECT COUNT(*) as count FROM cv_extraction_cache")
        cache_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT SUM(access_count) as total FROM cv_extraction_cache")
        total_accesses = cursor.fetchone()[0] or 0
        
        print(f"📊 Current cache status:")
        print(f"   - Cached extractions: {cache_count}")
        print(f"   - Total cache accesses: {total_accesses}")
        
        if cache_count == 0:
            print("ℹ️  Cache is already empty")
            return
        
        # Clear the cache
        print("\n🗑️  Clearing CV extraction cache...")
        cursor.execute("DELETE FROM cv_extraction_cache")
        conn.commit()
        
        # Verify it's cleared
        cursor.execute("SELECT COUNT(*) as count FROM cv_extraction_cache")
        new_count = cursor.fetchone()[0]
        
        if new_count == 0:
            print(f"✅ Successfully cleared {cache_count} cached extractions")
            print("📝 Next CV uploads will be re-extracted with Claude 4 Opus")
        else:
            print(f"⚠️  Warning: Cache still has {new_count} entries")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def show_cache_details():
    """Show detailed information about cached extractions"""
    
    if not DB_PATH or not os.path.exists(DB_PATH):
        return
    
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get top accessed cached files
        cursor.execute("""
            SELECT file_hash, extraction_model, confidence_score, 
                   access_count, created_at, last_accessed
            FROM cv_extraction_cache 
            ORDER BY access_count DESC 
            LIMIT 5
        """)
        
        rows = cursor.fetchall()
        if rows:
            print("\n📈 Top cached extractions by access count:")
            for row in rows:
                print(f"   Hash: {row['file_hash'][:8]}... | Accesses: {row['access_count']} | Score: {row['confidence_score']:.2f}")
        
        conn.close()
        
    except Exception as e:
        print(f"Could not show cache details: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("CV EXTRACTION CACHE CLEANER")
    print("=" * 60)
    
    # Show current cache details
    show_cache_details()
    
    # Ask for confirmation
    print("\n⚠️  WARNING: This will clear all cached CV extractions!")
    print("   Files will be re-extracted on next upload using Claude 4 Opus")
    
    response = input("\nDo you want to continue? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        clear_cv_extraction_cache()
    else:
        print("❌ Cancelled - cache was not cleared")
    
    print("=" * 60)