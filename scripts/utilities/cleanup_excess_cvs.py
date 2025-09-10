#!/usr/bin/env python3
"""
Utility script to clean up excess CVs for users who have more than the 10 CV limit.
This can be run manually to enforce the CV limit for all users.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.api.db import get_db_connection, enforce_cv_limit
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def cleanup_all_users_excess_cvs(max_cvs: int = 10):
    """
    Clean up excess CVs for all users in the database.
    
    Args:
        max_cvs: Maximum number of CVs allowed per user (default: 10)
    """
    conn = get_db_connection()
    total_deleted = 0
    users_affected = 0
    
    try:
        # Get all unique user IDs with their CV counts
        cursor = conn.execute("""
            SELECT user_id, COUNT(*) as cv_count
            FROM cv_uploads
            GROUP BY user_id
            HAVING cv_count > ?
        """, (max_cvs,))
        
        users_with_excess = cursor.fetchall()
        
        if not users_with_excess:
            logger.info(f"✅ No users have more than {max_cvs} CVs. Nothing to clean up.")
            return
        
        logger.info(f"Found {len(users_with_excess)} users with more than {max_cvs} CVs")
        
        for row in users_with_excess:
            user_id = row['user_id']
            cv_count = row['cv_count']
            excess_count = cv_count - max_cvs
            
            logger.info(f"\n👤 User: {user_id}")
            logger.info(f"   Current CVs: {cv_count} (exceeds limit by {excess_count})")
            
            # Enforce the CV limit
            deleted_cvs = enforce_cv_limit(user_id, max_cvs)
            
            if deleted_cvs:
                users_affected += 1
                total_deleted += len(deleted_cvs)
                logger.info(f"   🗑️  Deleted {len(deleted_cvs)} CVs:")
                for cv in deleted_cvs:
                    file_status = "✓ file deleted" if cv.get('file_deleted') else "⚠️ file not found"
                    logger.info(f"      - {cv['filename']} ({cv['upload_date']}) [{file_status}]")
            else:
                logger.warning(f"   ⚠️  No CVs were deleted despite having {cv_count} CVs")
        
        logger.info(f"\n📊 Summary:")
        logger.info(f"   Users affected: {users_affected}")
        logger.info(f"   Total CVs deleted: {total_deleted}")
        logger.info(f"   ✅ Cleanup complete!")
        
    except Exception as e:
        logger.error(f"❌ Error during cleanup: {e}")
        import traceback
        logger.error(traceback.format_exc())
    finally:
        conn.close()


def cleanup_specific_user(user_id: str, max_cvs: int = 10):
    """
    Clean up excess CVs for a specific user.
    
    Args:
        user_id: The user ID to clean up
        max_cvs: Maximum number of CVs allowed (default: 10)
    """
    conn = get_db_connection()
    
    try:
        # Get current CV count
        cursor = conn.execute("""
            SELECT COUNT(*) as cv_count
            FROM cv_uploads
            WHERE user_id = ?
        """, (user_id,))
        
        result = cursor.fetchone()
        if not result or result['cv_count'] == 0:
            logger.info(f"User {user_id} has no CVs")
            return
        
        cv_count = result['cv_count']
        logger.info(f"User {user_id} has {cv_count} CVs")
        
        if cv_count <= max_cvs:
            logger.info(f"✅ User is within the {max_cvs} CV limit. No cleanup needed.")
            return
        
        excess_count = cv_count - max_cvs
        logger.info(f"⚠️  User exceeds limit by {excess_count} CVs. Cleaning up...")
        
        # Enforce the CV limit
        deleted_cvs = enforce_cv_limit(user_id, max_cvs)
        
        if deleted_cvs:
            logger.info(f"🗑️  Deleted {len(deleted_cvs)} CVs:")
            for cv in deleted_cvs:
                file_status = "✓ file deleted" if cv.get('file_deleted') else "⚠️ file not found"
                logger.info(f"   - {cv['filename']} ({cv['upload_date']}) [{file_status}]")
            logger.info("✅ Cleanup complete!")
        else:
            logger.warning("⚠️  No CVs were deleted")
            
    except Exception as e:
        logger.error(f"❌ Error during cleanup: {e}")
        import traceback
        logger.error(traceback.format_exc())
    finally:
        conn.close()


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Clean up excess CVs for users')
    parser.add_argument('--user-id', type=str, help='Specific user ID to clean up')
    parser.add_argument('--max-cvs', type=int, default=10, help='Maximum CVs allowed per user (default: 10)')
    parser.add_argument('--all', action='store_true', help='Clean up all users with excess CVs')
    
    args = parser.parse_args()
    
    if args.user_id:
        cleanup_specific_user(args.user_id, args.max_cvs)
    elif args.all:
        cleanup_all_users_excess_cvs(args.max_cvs)
    else:
        print("Please specify either --user-id <user_id> or --all")
        print("\nExamples:")
        print("  python cleanup_excess_cvs.py --all")
        print("  python cleanup_excess_cvs.py --user-id abc123")
        print("  python cleanup_excess_cvs.py --user-id abc123 --max-cvs 5")
        sys.exit(1)


if __name__ == "__main__":
    main()