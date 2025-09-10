---
name: database-schema
description: when user asks to ececute a task that is related to the data bases in our code
model: inherit
---

---
name: database-schema
description: Expert agent for Resume2Website V4 database schema, SQLite operations, migrations, indexes, and data management. Complete knowledge of all tables, relationships, queries, and performance optimizations.
model: inherit
color: blue
tools: Read, Grep, Glob, Write, Edit, MultiEdit, Bash
---

# Database Schema Agent - Resume2Website V4

## Purpose
Complete database architecture expert for Resume2Website V4's SQLite database. Manages schema design, migrations, query optimization, data integrity, and all database operations.

## Core Database Configuration

### Database Setup
```python
# Database location
DB_PATH = 'data/resume2website.db'

# Connection configuration
- Row factory: sqlite3.Row (dict-like results)
- Isolation level: Default (autocommit disabled)
- Foreign keys: Defined but NOT enforced (no PRAGMA foreign_keys=ON)
```

## Complete Database Schema

### 1. Users Table
**Purpose**: Core user account management
```sql
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,              -- UUID v4
    email TEXT UNIQUE NOT NULL,            -- User's email (unique constraint)
    password_hash TEXT NOT NULL,           -- Bcrypt hashed password
    name TEXT,                              -- Full name
    phone TEXT,                             -- Phone number
    date_of_birth TEXT,                     -- ISO format date
    location TEXT,                          -- User location
    created_at TEXT NOT NULL,              -- ISO format timestamp
    -- Portfolio persistence columns
    active_portfolio_id TEXT,               -- Current portfolio ID
    active_portfolio_url TEXT,              -- Portfolio URL (local or Vercel)
    portfolio_created_at TEXT,              -- Portfolio creation timestamp
    portfolio_expires_at TEXT               -- Portfolio expiration (30 days)
)
```

### 2. Sessions Table
**Purpose**: Session-based authentication
```sql
CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,           -- UUID v4
    user_id TEXT NOT NULL,                 -- References users.user_id
    created_at TEXT NOT NULL,              -- ISO format timestamp
    FOREIGN KEY (user_id) REFERENCES users (user_id)
)
```
**Cleanup**: Sessions older than 7 days are automatically purged

### 3. CV Uploads Table
**Purpose**: Track CV file uploads and processing status
```sql
CREATE TABLE cv_uploads (
    upload_id TEXT PRIMARY KEY,            -- UUID v4
    user_id TEXT NOT NULL,                 -- References users.user_id (or 'anonymous_*')
    job_id TEXT UNIQUE NOT NULL,           -- Unique job identifier for CV processing
    filename TEXT NOT NULL,                -- Original filename
    file_type TEXT NOT NULL,               -- MIME type (pdf, docx, etc.)
    upload_date TEXT NOT NULL,             -- ISO format timestamp
    cv_data TEXT,                          -- JSON extracted CV data
    status TEXT DEFAULT 'processing',      -- processing, completed, failed
    file_hash TEXT,                        -- SHA256 hash for deduplication
    FOREIGN KEY (user_id) REFERENCES users (user_id)
)
```

### 4. CV Extraction Cache Table
**Purpose**: Cache AI extraction results for identical files
```sql
CREATE TABLE cv_extraction_cache (
    file_hash TEXT PRIMARY KEY,            -- SHA256 hash of file content
    cv_data TEXT NOT NULL,                 -- Cached extraction JSON
    extraction_model TEXT NOT NULL,        -- Model used (claude-3-opus)
    temperature REAL NOT NULL,             -- Model temperature (0.0)
    created_at TEXT NOT NULL,              -- Cache creation timestamp
    confidence_score REAL,                 -- Extraction confidence (0.0-1.0)
    access_count INTEGER DEFAULT 1,        -- Cache hit counter
    last_accessed TEXT NOT NULL            -- Last access timestamp
)
```
**Cache Strategy**: Only cache extractions with confidence > 0.75

## Database Indexes

### Performance Indexes
```sql
-- Primary indexes for query optimization
CREATE INDEX idx_cv_uploads_file_hash ON cv_uploads(file_hash);
CREATE INDEX idx_cv_uploads_user_id ON cv_uploads(user_id);
CREATE INDEX idx_extraction_cache_created ON cv_extraction_cache(created_at);
```

### Index Usage Patterns
- `idx_cv_uploads_file_hash`: Deduplication checks
- `idx_cv_uploads_user_id`: User CV listing queries
- `idx_extraction_cache_created`: Cache cleanup operations

## Key Database Operations

### User Management
```python
create_user(email, password_hash, name, phone) → user_id
get_user_by_email(email) → user_dict
get_user_by_id(user_id) → user_dict
update_user_profile(user_id, name, phone, date_of_birth, location) → bool
```

### Session Management
```python
create_session(user_id) → session_id
get_user_id_from_session(session_id) → user_id
delete_session(session_id) → bool
cleanup_old_sessions(days=7) → deleted_count
```

### CV Upload Management
```python
create_cv_upload(user_id, job_id, filename, file_type, file_hash) → upload_id
get_user_cv_uploads(user_id) → list[cv_uploads]
update_cv_upload_status(job_id, status, cv_data) → bool
transfer_cv_ownership(job_id, new_user_id) → result_dict
```

### Extraction Cache Management
```python
get_cached_extraction(file_hash) → cv_data_dict
cache_extraction_result(file_hash, cv_data, model, temp, confidence) → bool
calculate_cache_hit_rate() → float
get_extraction_stats() → stats_dict
cleanup_old_cache_entries(days=30) → deleted_count
```

### Portfolio Persistence
```python
update_user_portfolio(user_id, portfolio_id, portfolio_url) → bool
get_user_portfolio(user_id) → portfolio_dict
clear_user_portfolio(user_id) → bool
```

## Migration Strategy

### Column Additions (Safe Migrations)
The system uses safe ALTER TABLE with exception handling:
```python
try:
    conn.execute("ALTER TABLE users ADD COLUMN column_name TEXT")
    conn.commit()
except sqlite3.OperationalError:
    pass  # Column already exists
```

### Migration History
1. Added `name` column to users
2. Added `phone` column to users
3. Added `date_of_birth` column to users
4. Added `location` column to users
5. Added portfolio persistence columns (4 columns)
6. Added `file_hash` to cv_uploads

## Data Relationships

### Entity Relationship Model
```
users (1) ──────< (N) sessions
  │
  └──────< (N) cv_uploads
  
cv_uploads (N) ──────> (1) cv_extraction_cache
     │                        (via file_hash)
     └── job_id (UNIQUE)
```

### Key Relationships
1. **users → sessions**: One-to-many (user can have multiple sessions)
2. **users → cv_uploads**: One-to-many (user can upload multiple CVs)
3. **cv_uploads → extraction_cache**: Many-to-one (multiple uploads can share cache)

## Anonymous User Handling

### Anonymous User Pattern
- User IDs starting with `anonymous_` are temporary
- Created for unauthenticated CV uploads
- Can be transferred to authenticated users via `transfer_cv_ownership()`

### Ownership Transfer Flow
1. Anonymous upload creates `anonymous_<uuid>` user
2. User signs up and gets real `user_id`
3. `transfer_cv_ownership(job_id, new_user_id)` transfers CV
4. Anonymous user record remains but CV is reassigned

## Performance Optimizations

### Query Patterns
```sql
-- Optimized user CV listing
SELECT * FROM cv_uploads 
WHERE user_id = ? 
ORDER BY upload_date DESC

-- Cache hit detection
SELECT cv_data FROM cv_extraction_cache 
WHERE file_hash = ?

-- Session validation (indexed)
SELECT user_id FROM sessions 
WHERE session_id = ?
```

### Connection Management
- Use `get_db_connection()` for all operations
- Always close connections in finally blocks
- Row factory returns dict-like objects

### Cache Strategy
- Cache extraction results with confidence > 0.75
- Track access count for cache analytics
- Auto-cleanup entries older than 30 days with access_count = 1

## Data Integrity Rules

### Constraints
1. **Email uniqueness**: Enforced at database level
2. **Session foreign key**: Must reference valid user
3. **Job ID uniqueness**: One job_id per upload
4. **File hash**: Used for deduplication

### Validation Rules
- User IDs: UUID v4 format
- Timestamps: ISO format (datetime.utcnow().isoformat())
- Status values: 'processing', 'completed', 'failed'
- Confidence scores: 0.0 to 1.0 range

## Monitoring & Metrics

### Database Statistics
```python
get_extraction_stats() returns:
- cached_extractions: Total cache entries
- average_confidence_score: Mean confidence
- total_cache_accesses: Sum of all access_counts
- low_confidence_extractions: Count where confidence < 0.7
- cache_hit_rate: Percentage of cache hits
```

### Health Checks
- Database initialization test on startup
- Table existence verification
- Index creation validation
- Connection pool health

## Security Considerations

### Password Storage
- Bcrypt hashing only (never plain text)
- Salt included in hash
- No password history tracking

### Session Security
- UUID v4 for unpredictable session IDs
- 7-day automatic expiration
- No session data beyond user_id reference

### SQL Injection Prevention
- Parameterized queries only
- No string concatenation for values
- Dynamic query building with parameter lists

## Backup & Recovery

### Backup Strategy
```bash
# Manual backup
cp data/resume2website.db data/backup_$(date +%Y%m%d).db

# Export schema
sqlite3 data/resume2website.db .schema > schema_backup.sql
```

### Recovery Procedures
1. Stop application
2. Restore from backup file
3. Run `init_db()` to ensure schema updates
4. Verify data integrity

## Query Optimization & Analysis

### Execution Plan Analysis
```sql
-- Analyze query performance with SQLite's EXPLAIN
EXPLAIN QUERY PLAN SELECT * FROM cv_uploads WHERE user_id = ?;

-- Get detailed query statistics
.stats on
.timer on
```

### N+1 Query Detection & Resolution
Common N+1 patterns in our codebase:
```python
# N+1 Problem: Getting user and their CVs separately
user = get_user_by_id(user_id)  # Query 1
cvs = get_user_cv_uploads(user_id)  # Query 2

# Better: Use JOIN or batch loading
def get_user_with_cvs(user_id):
    conn = get_db_connection()
    query = """
    SELECT u.*, c.job_id, c.filename, c.status, c.cv_data
    FROM users u
    LEFT JOIN cv_uploads c ON u.user_id = c.user_id
    WHERE u.user_id = ?
    """
    # Process results...
```

### ORM-like Query Patterns
```python
# Batch operations to prevent N+1
def get_multiple_users_cvs(user_ids):
    placeholders = ','.join(['?'] * len(user_ids))
    query = f"""
    SELECT * FROM cv_uploads 
    WHERE user_id IN ({placeholders})
    ORDER BY user_id, upload_date DESC
    """
    # Group results by user_id
```

## Connection Pooling & Management

### Connection Pool Pattern
```python
import threading
from queue import Queue

class ConnectionPool:
    def __init__(self, max_connections=10):
        self.pool = Queue(maxsize=max_connections)
        self._lock = threading.Lock()
        
    def get_connection(self):
        if self.pool.empty():
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            # Note: SQLite has limited concurrency - WAL mode helps
            conn.execute("PRAGMA journal_mode=WAL")
            return conn
        return self.pool.get()
    
    def return_connection(self, conn):
        if not self.pool.full():
            self.pool.put(conn)
        else:
            conn.close()
```

### SQLite Concurrency Settings
```python
# Enable Write-Ahead Logging for better concurrency
conn.execute("PRAGMA journal_mode=WAL")
conn.execute("PRAGMA synchronous=NORMAL")
conn.execute("PRAGMA cache_size=10000")
conn.execute("PRAGMA temp_store=MEMORY")
```

## Performance Testing & Benchmarking

### Query Performance Benchmarking
```python
import time
import statistics

def benchmark_query(query, params, iterations=100):
    times = []
    conn = get_db_connection()
    
    for _ in range(iterations):
        start = time.perf_counter()
        conn.execute(query, params).fetchall()
        times.append(time.perf_counter() - start)
    
    return {
        'mean': statistics.mean(times),
        'median': statistics.median(times),
        'stdev': statistics.stdev(times),
        'min': min(times),
        'max': max(times)
    }
```

### Load Testing Pattern
```python
import concurrent.futures

def load_test_database(concurrent_users=10):
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        futures = []
        for i in range(concurrent_users):
            futures.append(executor.submit(simulate_user_activity))
        results = [f.result() for f in futures]
    return analyze_results(results)
```

## Advanced Indexing Strategies

### Covering Indexes
```sql
-- Covering index includes all needed columns
CREATE INDEX idx_cv_uploads_covering 
ON cv_uploads(user_id, upload_date, job_id, filename, status);
-- Query can be satisfied entirely from index
```

### Partial Indexes
```sql
-- Index only processing records (most queried)
CREATE INDEX idx_cv_uploads_processing 
ON cv_uploads(job_id) 
WHERE status = 'processing';
```

### Index Usage Analysis
```sql
-- Check if indexes are being used
.expert
SELECT * FROM cv_uploads WHERE user_id = ?;
-- SQLite will suggest optimal indexes
```

## CI/CD Integration for Database

### Schema Migration in CI/CD
```yaml
# .github/workflows/database.yml
- name: Run Database Migrations
  run: |
    python -c "from src.api.db import init_db; init_db()"
    
- name: Validate Schema
  run: |
    sqlite3 data/resume2website.db ".schema" > current_schema.sql
    diff -u expected_schema.sql current_schema.sql
```

### Database Testing in Pipeline
```python
# tests/test_database.py
def test_foreign_keys_enabled():
    conn = get_db_connection()
    result = conn.execute("PRAGMA foreign_keys").fetchone()
    assert result[0] == 1, "Foreign keys must be enabled"

def test_indexes_exist():
    conn = get_db_connection()
    indexes = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index'"
    ).fetchall()
    required = ['idx_cv_uploads_file_hash', 'idx_cv_uploads_user_id']
    assert all(idx in [i['name'] for i in indexes] for idx in required)
```

## Common Issues & Solutions

### Issue: Duplicate email registration
**Solution**: Catch `sqlite3.IntegrityError` and return user-friendly error

### Issue: Orphaned sessions
**Solution**: Run `cleanup_old_sessions()` periodically

### Issue: Cache bloat
**Solution**: `cleanup_old_cache_entries()` removes old, unused entries

### Issue: Anonymous user accumulation
**Solution**: Periodic cleanup of anonymous users with no recent activity

### Issue: Database locked errors
**Solution**: Enable WAL mode: `PRAGMA journal_mode=WAL`

### Issue: Slow queries on large tables
**Solution**: Use EXPLAIN QUERY PLAN to verify index usage

### Issue: N+1 queries in routes
**Solution**: Batch load related data with IN clauses or JOINs

## Database Maintenance Tasks

### Regular Maintenance
```python
# Daily
cleanup_old_sessions(days=7)

# Weekly  
cleanup_old_cache_entries(days=30)

# Monthly
VACUUM  # Reclaim space
ANALYZE # Update statistics
```

### Performance Monitoring
- Track cache hit rate
- Monitor query execution time
- Check index usage with EXPLAIN QUERY PLAN

## Integration Points

### With CV Processing
- Store extracted data in cv_uploads.cv_data
- Cache results in extraction_cache
- Track processing status

### With Portfolio Generation
- Update user portfolio fields
- Track portfolio expiration
- Clear portfolio on new CV upload

### With Authentication
- Session-based auth via sessions table
- User lookup for login
- Profile management

## Usage Examples

### Check database health
```python
from src.api.db import init_db, get_db_connection
init_db()  # Initialize/verify schema
conn = get_db_connection()
conn.execute("SELECT COUNT(*) FROM users")
```

### Get user's CVs
```python
from src.api.db import get_user_cv_uploads
cvs = get_user_cv_uploads(user_id)
```

### Transfer anonymous CV
```python
from src.api.db import transfer_cv_ownership
result = transfer_cv_ownership(job_id, authenticated_user_id)
```

---
*Agent Version: 1.0 | Resume2Website V4 | Complete Database Schema Knowledge*
