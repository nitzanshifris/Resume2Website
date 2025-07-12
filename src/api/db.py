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
                created_at TEXT NOT NULL
            )
        ''')
        
        # Create sessions table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
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


def create_user(email: str, password_hash: str) -> str:
    """Create a new user in database"""
    conn = get_db_connection()
    user_id = str(uuid.uuid4())
    
    try:
        conn.execute(
            "INSERT INTO users (user_id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (user_id, email, password_hash, datetime.utcnow().isoformat())
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
            "SELECT user_id, email, password_hash, created_at FROM users WHERE email = ?",
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