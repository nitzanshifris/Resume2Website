"""
Database functions for CV2WEB MVP
"""
import sqlite3
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Database configuration
DB_PATH = 'data/cv2web.db'


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
        
        # Create sessions table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Create cv_uploads table with file_hash for caching
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
                file_hash TEXT,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
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
        
        # Create indexes for performance
        conn.execute('CREATE INDEX IF NOT EXISTS idx_cv_uploads_file_hash ON cv_uploads(file_hash)')
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


def create_user(email: str, password_hash: str, name: str = None) -> str:
    """Create a new user in database"""
    conn = get_db_connection()
    user_id = str(uuid.uuid4())
    
    try:
        conn.execute(
            "INSERT INTO users (user_id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, email, password_hash, name, datetime.utcnow().isoformat())
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
            "SELECT user_id, email, password_hash, name, created_at FROM users WHERE email = ?",
            (email,)
        )
        row = cursor.fetchone()
        
        if row:
            return dict(row)  # With row_factory this is cleaner
        return None
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
    """Get all CV uploads for a user"""
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