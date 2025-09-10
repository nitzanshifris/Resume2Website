"""
Database functions for RESUME2WEBSITE MVP
"""
import os
import sqlite3
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Database configuration
DB_PATH = os.getenv('DATABASE_URL', 'data/resume2website.db').replace('sqlite:///', '')


def get_db_connection():
    """Get database connection with row factory"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Returns results as dict-like objects
    return conn


def init_db():
    """Initialize SQLite database with required tables"""
    conn = None
    try:
        conn = get_db_connection()
        
        # Create users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                created_at TEXT NOT NULL
            )
        ''')
        
        # Add name column to existing users table if it doesn't exist
        try:
            conn.execute("ALTER TABLE users ADD COLUMN name TEXT")
            conn.commit()
        except sqlite3.OperationalError:
            # Column already exists, ignore
            pass
        
        # Add phone column to existing users table if it doesn't exist
        try:
            conn.execute("ALTER TABLE users ADD COLUMN phone TEXT")
            conn.commit()
        except sqlite3.OperationalError:
            # Column already exists, ignore
            pass
        
        # Add date_of_birth column to existing users table if it doesn't exist
        try:
            conn.execute("ALTER TABLE users ADD COLUMN date_of_birth TEXT")
            conn.commit()
        except sqlite3.OperationalError:
            # Column already exists, ignore
            pass
        
        # Add location column to existing users table if it doesn't exist
        try:
            conn.execute("ALTER TABLE users ADD COLUMN location TEXT")
            conn.commit()
        except sqlite3.OperationalError:
            # Column already exists, ignore
            pass
        
        # Add portfolio persistence columns
        try:
            conn.execute("ALTER TABLE users ADD COLUMN active_portfolio_id TEXT")
            conn.commit()
            logger.info("Added active_portfolio_id column to users table")
        except sqlite3.OperationalError:
            pass
        
        try:
            conn.execute("ALTER TABLE users ADD COLUMN active_portfolio_url TEXT")
            conn.commit()
            logger.info("Added active_portfolio_url column to users table")
        except sqlite3.OperationalError:
            pass
        
        try:
            conn.execute("ALTER TABLE users ADD COLUMN portfolio_created_at TEXT")
            conn.commit()
            logger.info("Added portfolio_created_at column to users table")
        except sqlite3.OperationalError:
            pass
        
        try:
            conn.execute("ALTER TABLE users ADD COLUMN portfolio_expires_at TEXT")
            conn.commit()
            logger.info("Added portfolio_expires_at column to users table")
        except sqlite3.OperationalError:
            pass
        
        # Create sessions table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Create cv_uploads table 
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cv_uploads (
                upload_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                job_id TEXT UNIQUE NOT NULL,
                filename TEXT NOT NULL,
                file_type TEXT NOT NULL,
                upload_date TEXT NOT NULL,
                cv_data TEXT,
                status TEXT DEFAULT 'processing',
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Add file_hash column if it doesn't exist (migration)
        try:
            conn.execute('ALTER TABLE cv_uploads ADD COLUMN file_hash TEXT')
            logger.info("Added file_hash column to cv_uploads table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                logger.info("file_hash column already exists")
            else:
                logger.warning(f"Unexpected error adding file_hash column: {e}")
        
        # Create cv_extraction_cache table for deterministic caching
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cv_extraction_cache (
                file_hash TEXT PRIMARY KEY,
                cv_data TEXT NOT NULL,
                extraction_model TEXT NOT NULL,
                temperature REAL NOT NULL,
                created_at TEXT NOT NULL,
                confidence_score REAL,
                access_count INTEGER DEFAULT 1,
                last_accessed TEXT NOT NULL
            )
        ''')
        
        # Create indexes for performance (safe creation)
        try:
            conn.execute('CREATE INDEX IF NOT EXISTS idx_cv_uploads_file_hash ON cv_uploads(file_hash)')
            logger.info("Created file_hash index")
        except sqlite3.OperationalError as e:
            logger.warning(f"Could not create file_hash index: {e}")
            
        conn.execute('CREATE INDEX IF NOT EXISTS idx_cv_uploads_user_id ON cv_uploads(user_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_extraction_cache_created ON cv_extraction_cache(created_at)')
        
        # Test the connection and tables
        conn.execute("SELECT COUNT(*) FROM users")
        conn.execute("SELECT COUNT(*) FROM sessions")
        
        conn.commit()
        logger.info("Database initialized successfully")
        
    except sqlite3.Error as e:
        logger.error(f"Database initialization failed: {e}")
        raise Exception(f"Critical: Cannot initialize database - {e}")
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {e}")
        raise
    finally:
        if conn:
            conn.close()


def create_user(email: str, password_hash: str, name: str = None, phone: str = None) -> str:
    """Create a new user in database"""
    conn = get_db_connection()
    user_id = str(uuid.uuid4())
    
    try:
        conn.execute(
            "INSERT INTO users (user_id, email, password_hash, name, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, email, password_hash, name, phone, datetime.utcnow().isoformat())
        )
        conn.commit()
        return user_id
    except sqlite3.IntegrityError:
        # Email already exists
        raise ValueError("Email already registered")
    finally:
        conn.close()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get user by email"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "SELECT user_id, email, password_hash, name, phone, date_of_birth, location, created_at FROM users WHERE email = ?",
            (email,)
        )
        row = cursor.fetchone()
        
        if row:
            return dict(row)  # With row_factory this is cleaner
        return None
    finally:
        conn.close()


def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "SELECT user_id, email, password_hash, name, phone, date_of_birth, location, created_at FROM users WHERE user_id = ?",
            (user_id,)
        )
        row = cursor.fetchone()
        
        if row:
            return dict(row)
        return None
    finally:
        conn.close()


def update_user_profile(user_id: str, name: str = None, phone: str = None, date_of_birth: str = None, location: str = None) -> bool:
    """Update user profile information"""
    conn = get_db_connection()
    try:
        # Build dynamic update query based on provided fields
        updates = []
        values = []
        
        if name is not None:
            updates.append("name = ?")
            values.append(name)
        if phone is not None:
            updates.append("phone = ?")
            values.append(phone)
        if date_of_birth is not None:
            updates.append("date_of_birth = ?")
            values.append(date_of_birth)
        if location is not None:
            updates.append("location = ?")
            values.append(location)
        
        if not updates:
            return False  # No fields to update
        
        values.append(user_id)  # Add user_id for WHERE clause
        
        query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = ?"
        conn.execute(query, values)
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Failed to update user profile: {e}")
        return False
    finally:
        conn.close()


def create_session(user_id: str) -> str:
    """Create a new session"""
    conn = get_db_connection()
    session_id = str(uuid.uuid4())
    
    try:
        conn.execute(
            "INSERT INTO sessions (session_id, user_id, created_at) VALUES (?, ?, ?)",
            (session_id, user_id, datetime.utcnow().isoformat())
        )
        conn.commit()
        return session_id
    finally:
        conn.close()


def get_user_id_from_session(session_id: str) -> Optional[str]:
    """Get user_id from session"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "SELECT user_id FROM sessions WHERE session_id = ?",
            (session_id,)
        )
        row = cursor.fetchone()
        return row["user_id"] if row else None
    finally:
        conn.close()


def delete_session(session_id: str) -> bool:
    """Delete a specific session"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM sessions WHERE session_id = ?",
            (session_id,)
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def cleanup_old_sessions(days: int = 7) -> int:
    """Delete sessions older than specified days"""
    conn = get_db_connection()
    try:
        cutoff = (datetime.now() - timedelta(days=days)).isoformat()
        cursor = conn.execute(
            "DELETE FROM sessions WHERE created_at < ?",
            (cutoff,)
        )
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()


def create_cv_upload(user_id: str, job_id: str, filename: str, file_type: str, file_hash: str = None) -> str:
    """Create a new CV upload record with optional file hash"""
    conn = get_db_connection()
    upload_id = str(uuid.uuid4())
    
    try:
        conn.execute(
            """INSERT INTO cv_uploads 
            (upload_id, user_id, job_id, filename, file_type, upload_date, status, file_hash) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (upload_id, user_id, job_id, filename, file_type, datetime.utcnow().isoformat(), 'processing', file_hash)
        )
        conn.commit()
        return upload_id
    finally:
        conn.close()


def get_user_cv_uploads(user_id: str) -> list:
    """Get all CV uploads for a user, sorted by most recent first"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """SELECT upload_id, job_id, filename, file_type, upload_date, status, cv_data
            FROM cv_uploads 
            WHERE user_id = ? 
            ORDER BY upload_date DESC""",
            (user_id,)
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_user_cv_count(user_id: str) -> int:
    """Get the count of CV uploads for a user"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """SELECT COUNT(*) as count
            FROM cv_uploads 
            WHERE user_id = ?""",
            (user_id,)
        )
        result = cursor.fetchone()
        return result['count'] if result else 0
    finally:
        conn.close()


def delete_oldest_cv(user_id: str) -> dict:
    """Delete the oldest CV upload for a user and return its info"""
    conn = get_db_connection()
    try:
        # First get the oldest CV info
        cursor = conn.execute(
            """SELECT upload_id, job_id, filename, upload_date
            FROM cv_uploads 
            WHERE user_id = ? 
            ORDER BY upload_date ASC
            LIMIT 1""",
            (user_id,)
        )
        oldest_cv = cursor.fetchone()
        
        if oldest_cv:
            oldest_cv_dict = dict(oldest_cv)
            
            # Delete the oldest CV
            conn.execute(
                """DELETE FROM cv_uploads 
                WHERE upload_id = ?""",
                (oldest_cv_dict['upload_id'],)
            )
            conn.commit()
            
            # Also delete the file from disk if it exists
            import os
            from pathlib import Path
            BASE_DIR = Path(__file__).parent.parent.parent
            upload_dir = BASE_DIR / "data" / "uploads"
            
            # Try different file path patterns
            possible_paths = []
            
            # Extract file extension from filename
            file_ext = ''
            if '.' in oldest_cv_dict['filename']:
                file_ext = '.' + oldest_cv_dict['filename'].split('.')[-1]
            
            # Check standard single file path
            possible_paths.append(upload_dir / f"{oldest_cv_dict['job_id']}{file_ext}")
            
            # Check for multi-file upload directory
            possible_paths.append(upload_dir / oldest_cv_dict['job_id'])
            
            file_deleted = False
            for file_path in possible_paths:
                if file_path.exists():
                    try:
                        if file_path.is_dir():
                            # Multi-file upload - delete entire directory
                            import shutil
                            shutil.rmtree(file_path)
                        else:
                            # Single file - delete file
                            os.remove(file_path)
                        file_deleted = True
                        oldest_cv_dict['file_deleted'] = True
                        oldest_cv_dict['deleted_path'] = str(file_path)
                        break
                    except Exception as e:
                        print(f"Failed to delete {file_path}: {e}")
            
            if not file_deleted:
                oldest_cv_dict['file_deleted'] = False
                
            return oldest_cv_dict
        
        return None
    finally:
        conn.close()


def enforce_cv_limit(user_id: str, max_cvs: int = 10) -> list:
    """
    Enforce maximum CV limit per user.
    Returns list of deleted CV info if any were deleted.
    """
    deleted_cvs = []
    
    conn = get_db_connection()
    try:
        # Get all CVs sorted by date (oldest first)
        cursor = conn.execute(
            """SELECT upload_id, job_id, filename, upload_date
            FROM cv_uploads 
            WHERE user_id = ? 
            ORDER BY upload_date ASC""",
            (user_id,)
        )
        all_cvs = cursor.fetchall()
        
        # If we have more than max_cvs, delete the oldest ones
        if len(all_cvs) > max_cvs:
            cvs_to_delete = all_cvs[:len(all_cvs) - max_cvs]
            
            for cv in cvs_to_delete:
                cv_dict = dict(cv)
                
                # Delete from database
                conn.execute(
                    """DELETE FROM cv_uploads 
                    WHERE upload_id = ?""",
                    (cv_dict['upload_id'],)
                )
                
                # Try to delete the file
                import os
                from pathlib import Path
                BASE_DIR = Path(__file__).parent.parent.parent
                upload_dir = BASE_DIR / "data" / "uploads"
                
                # Try different file path patterns
                possible_paths = []
                
                # Extract file extension from filename
                file_ext = ''
                if '.' in cv_dict['filename']:
                    file_ext = '.' + cv_dict['filename'].split('.')[-1]
                
                # Check standard single file path
                possible_paths.append(upload_dir / f"{cv_dict['job_id']}{file_ext}")
                
                # Check for multi-file upload directory
                possible_paths.append(upload_dir / cv_dict['job_id'])
                
                file_deleted = False
                for file_path in possible_paths:
                    if file_path.exists():
                        try:
                            if file_path.is_dir():
                                # Multi-file upload - delete entire directory
                                import shutil
                                shutil.rmtree(file_path)
                            else:
                                # Single file - delete file
                                os.remove(file_path)
                            file_deleted = True
                            cv_dict['file_deleted'] = True
                            cv_dict['deleted_path'] = str(file_path)
                            break
                        except Exception as e:
                            print(f"Failed to delete {file_path}: {e}")
                
                if not file_deleted:
                    cv_dict['file_deleted'] = False
                    
                deleted_cvs.append(cv_dict)
            
            conn.commit()
    finally:
        conn.close()
    
    return deleted_cvs


def update_cv_upload_status(job_id: str, status: str, cv_data: str = None) -> bool:
    """Update CV upload status and optionally CV data"""
    conn = get_db_connection()
    try:
        if cv_data:
            conn.execute(
                "UPDATE cv_uploads SET status = ?, cv_data = ? WHERE job_id = ?",
                (status, cv_data, job_id)
            )
        else:
            conn.execute(
                "UPDATE cv_uploads SET status = ? WHERE job_id = ?",
                (status, job_id)
            )
        conn.commit()
        return conn.total_changes > 0
    finally:
        conn.close()


def transfer_cv_ownership(job_id: str, new_user_id: str) -> Dict[str, Any]:
    """
    Transfer ownership of a CV from anonymous user to authenticated user.
    
    Args:
        job_id: The job_id of the CV to transfer
        new_user_id: The authenticated user's ID to transfer ownership to
        
    Returns:
        Dict with success status and details
    """
    conn = get_db_connection()
    try:
        # First, get the current CV upload record
        cursor = conn.execute(
            "SELECT user_id, filename, status FROM cv_uploads WHERE job_id = ?",
            (job_id,)
        )
        row = cursor.fetchone()
        
        if not row:
            return {"success": False, "error": "CV not found", "code": "NOT_FOUND"}
        
        current_owner = row['user_id']
        
        # Check if it's an anonymous user (starts with 'anonymous_')
        if not current_owner.startswith('anonymous_'):
            # Check if already owned by the requesting user
            if current_owner == new_user_id:
                return {"success": True, "message": "CV already owned by user", "already_owned": True}
            else:
                return {"success": False, "error": "CV owned by another user", "code": "FORBIDDEN"}
        
        # Transfer ownership using atomic UPDATE
        result = conn.execute(
            "UPDATE cv_uploads SET user_id = ? WHERE job_id = ? AND user_id LIKE 'anonymous_%'",
            (new_user_id, job_id)
        )
        conn.commit()
        
        if result.rowcount > 0:
            logger.info(f"Successfully transferred CV {job_id} from {current_owner} to {new_user_id}")
            return {
                "success": True, 
                "message": "CV ownership transferred successfully",
                "job_id": job_id,
                "previous_owner": current_owner,
                "new_owner": new_user_id
            }
        else:
            return {"success": False, "error": "Failed to transfer ownership", "code": "UPDATE_FAILED"}
            
    except Exception as e:
        logger.error(f"Error transferring CV ownership: {e}")
        return {"success": False, "error": str(e), "code": "INTERNAL_ERROR"}
    finally:
        conn.close()


# ========== EXTRACTION CACHING FUNCTIONS ==========

def get_cached_extraction(file_hash: str) -> Optional[dict]:
    """Get cached extraction result by file hash"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """SELECT cv_data, extraction_model, temperature, confidence_score, access_count
            FROM cv_extraction_cache 
            WHERE file_hash = ?""",
            (file_hash,)
        )
        row = cursor.fetchone()
        
        if row:
            # Update access count and last accessed
            conn.execute(
                "UPDATE cv_extraction_cache SET access_count = access_count + 1, last_accessed = ? WHERE file_hash = ?",
                (datetime.utcnow().isoformat(), file_hash)
            )
            conn.commit()
            
            return {
                'cv_data': row['cv_data'],
                'extraction_model': row['extraction_model'],
                'temperature': row['temperature'],
                'confidence_score': row['confidence_score'],
                'access_count': row['access_count']
            }
        return None
    finally:
        conn.close()


def cache_extraction_result(file_hash: str, cv_data: str, extraction_model: str, 
                          temperature: float, confidence_score: float = None) -> bool:
    """Cache extraction result for future use"""
    conn = get_db_connection()
    try:
        now = datetime.utcnow().isoformat()
        conn.execute(
            """INSERT OR REPLACE INTO cv_extraction_cache 
            (file_hash, cv_data, extraction_model, temperature, created_at, 
             confidence_score, access_count, last_accessed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (file_hash, cv_data, extraction_model, temperature, now, confidence_score, 1, now)
        )
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Failed to cache extraction result: {e}")
        return False
    finally:
        conn.close()


def calculate_cache_hit_rate() -> float:
    """Calculate cache hit rate for monitoring"""
    conn = get_db_connection()
    try:
        # Get total uploads
        cursor = conn.execute("SELECT COUNT(*) as total FROM cv_uploads WHERE file_hash IS NOT NULL")
        total_uploads = cursor.fetchone()['total']
        
        if total_uploads == 0:
            return 0.0
        
        # Get cache hits (uploads with file_hash that exists in cache)
        cursor = conn.execute("""
            SELECT COUNT(*) as hits 
            FROM cv_uploads u 
            INNER JOIN cv_extraction_cache c ON u.file_hash = c.file_hash
        """)
        cache_hits = cursor.fetchone()['hits']
        
        return cache_hits / total_uploads if total_uploads > 0 else 0.0
    finally:
        conn.close()


def get_extraction_stats() -> dict:
    """Get extraction statistics for monitoring"""
    conn = get_db_connection()
    try:
        stats = {}
        
        # Cache statistics
        cursor = conn.execute("SELECT COUNT(*) as count FROM cv_extraction_cache")
        stats['cached_extractions'] = cursor.fetchone()['count']
        
        cursor = conn.execute("SELECT AVG(confidence_score) as avg_score FROM cv_extraction_cache WHERE confidence_score IS NOT NULL")
        result = cursor.fetchone()
        stats['average_confidence_score'] = result['avg_score'] if result['avg_score'] else 0.0
        
        cursor = conn.execute("SELECT SUM(access_count) as total_accesses FROM cv_extraction_cache")
        stats['total_cache_accesses'] = cursor.fetchone()['total_accesses'] or 0
        
        # Low confidence extractions
        cursor = conn.execute("SELECT COUNT(*) as count FROM cv_extraction_cache WHERE confidence_score < 0.7")
        stats['low_confidence_extractions'] = cursor.fetchone()['count']
        
        # Cache hit rate
        stats['cache_hit_rate'] = calculate_cache_hit_rate()
        
        return stats
    finally:
        conn.close()


def cleanup_old_cache_entries(days: int = 30) -> int:
    """Clean up cache entries older than specified days"""
    conn = get_db_connection()
    try:
        cutoff = (datetime.now() - timedelta(days=days)).isoformat()
        cursor = conn.execute(
            "DELETE FROM cv_extraction_cache WHERE created_at < ? AND access_count = 1",
            (cutoff,)
        )
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()


# ========== PORTFOLIO PERSISTENCE FUNCTIONS ==========

def update_user_portfolio(user_id: str, portfolio_id: str, portfolio_url: str) -> bool:
    """Update user's active portfolio information"""
    conn = get_db_connection()
    try:
        now = datetime.utcnow()
        expires_at = now + timedelta(days=30)  # Portfolio expires in 30 days
        
        conn.execute(
            """UPDATE users 
            SET active_portfolio_id = ?, 
                active_portfolio_url = ?, 
                portfolio_created_at = ?, 
                portfolio_expires_at = ?
            WHERE user_id = ?""",
            (portfolio_id, portfolio_url, now.isoformat(), expires_at.isoformat(), user_id)
        )
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Failed to update user portfolio: {e}")
        return False
    finally:
        conn.close()


def get_user_portfolio(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user's active portfolio if not expired"""
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """SELECT active_portfolio_id, active_portfolio_url, 
                      portfolio_created_at, portfolio_expires_at
            FROM users WHERE user_id = ?""",
            (user_id,)
        )
        row = cursor.fetchone()
        
        if row and row['active_portfolio_url']:
            # Check if portfolio is still valid (not expired)
            expires_at = row['portfolio_expires_at']
            if expires_at:
                expiry_date = datetime.fromisoformat(expires_at)
                if expiry_date > datetime.utcnow():
                    return {
                        'portfolio_id': row['active_portfolio_id'],
                        'portfolio_url': row['active_portfolio_url'],
                        'created_at': row['portfolio_created_at'],
                        'expires_at': row['portfolio_expires_at']
                    }
        
        return None
    finally:
        conn.close()


def clear_user_portfolio(user_id: str) -> bool:
    """Clear user's active portfolio (when uploading new CV)"""
    conn = get_db_connection()
    try:
        conn.execute(
            """UPDATE users 
            SET active_portfolio_id = NULL, 
                active_portfolio_url = NULL, 
                portfolio_created_at = NULL, 
                portfolio_expires_at = NULL
            WHERE user_id = ?""",
            (user_id,)
        )
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Failed to clear user portfolio: {e}")
        return False
    finally:
        conn.close()


# Alias for consistency with portfolio_generator.py
remove_user_portfolio = clear_user_portfolio