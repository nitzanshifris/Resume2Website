#!/usr/bin/env python3
"""
View all registered users in the CV2WEB database
"""
import sqlite3
from datetime import datetime
import json

def view_users():
    """Display all users in the database"""
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("""
        SELECT user_id, email, name, phone, location, date_of_birth, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    
    users = cursor.fetchall()
    
    print("\n" + "="*100)
    print("CV2WEB REGISTERED USERS")
    print("="*100)
    print(f"\nTotal Users: {len(users)}")
    print("-"*100)
    
    for i, user in enumerate(users, 1):
        print(f"\n{i}. User ID: {user['user_id']}")
        print(f"   Email: {user['email']}")
        print(f"   Name: {user['name'] or 'Not provided'}")
        print(f"   Phone: {user['phone'] or 'Not provided'}")
        print(f"   Location: {user['location'] or 'Not provided'}")
        print(f"   Created: {user['created_at']}")
    
    # Get some statistics
    print("\n" + "="*100)
    print("STATISTICS")
    print("="*100)
    
    # Check for OAuth users (those without traditional password hash or with specific patterns)
    cursor.execute("""
        SELECT 
            CASE 
                WHEN password_hash LIKE 'oauth_%' THEN 'OAuth'
                WHEN LENGTH(password_hash) = 64 THEN 'Email (SHA256)'
                ELSE 'Email (Bcrypt)'
            END as auth_method,
            COUNT(*) as count
        FROM users
        GROUP BY auth_method
    """)
    
    auth_methods = cursor.fetchall()
    print("\nUsers by Authentication Method:")
    for method in auth_methods:
        print(f"  - {method['auth_method']}: {method['count']} users")
    
    # Recent signups
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM users
        WHERE datetime(created_at) > datetime('now', '-1 day')
    """)
    
    recent = cursor.fetchone()
    print(f"\nSignups in last 24 hours: {recent['count']}")
    
    # Recent signups (last 7 days)
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM users
        WHERE datetime(created_at) > datetime('now', '-7 days')
    """)
    
    recent_week = cursor.fetchone()
    print(f"Signups in last 7 days: {recent_week['count']}")
    
    # Users with CVs
    cursor.execute("""
        SELECT COUNT(DISTINCT user_id) as count
        FROM cv_uploads
    """)
    
    with_cvs = cursor.fetchone()
    print(f"\nUsers who have uploaded CVs: {with_cvs['count']}")
    
    # Total CVs uploaded
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM cv_uploads
    """)
    
    total_cvs = cursor.fetchone()
    print(f"Total CVs uploaded: {total_cvs['count']}")
    
    conn.close()

def view_recent_sessions():
    """Display recent active sessions"""
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("\n" + "="*100)
    print("RECENT ACTIVE SESSIONS (Last 10)")
    print("="*100)
    
    cursor.execute("""
        SELECT s.session_id, s.user_id, u.email, u.name, s.created_at
        FROM sessions s
        JOIN users u ON s.user_id = u.user_id
        ORDER BY s.created_at DESC
        LIMIT 10
    """)
    
    sessions = cursor.fetchall()
    
    for session in sessions:
        print(f"\nSession: {session['session_id'][:30]}...")
        print(f"  User: {session['email']} ({session['name'] or 'No name'})")
        print(f"  Created: {session['created_at']}")
    
    conn.close()

def search_user(email=None):
    """Search for a specific user by email"""
    if not email:
        email = input("\nEnter email to search: ")
    
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM users
        WHERE email LIKE ?
    """, (f"%{email}%",))
    
    users = cursor.fetchall()
    
    if users:
        print(f"\nFound {len(users)} user(s) matching '{email}':")
        for user in users:
            print(f"\n  Email: {user['email']}")
            print(f"  Name: {user['name']}")
            print(f"  User ID: {user['user_id']}")
            print(f"  Created: {user['created_at']}")
            
            # Check their CVs
            cursor.execute("""
                SELECT COUNT(*) as cv_count
                FROM cv_uploads
                WHERE user_id = ?
            """, (user['user_id'],))
            
            cv_count = cursor.fetchone()
            print(f"  CVs uploaded: {cv_count['cv_count']}")
    else:
        print(f"\nNo users found matching '{email}'")
    
    conn.close()

def export_users_to_csv():
    """Export users to CSV file"""
    import csv
    
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT user_id, email, name, phone, location, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    
    users = cursor.fetchall()
    
    filename = f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['user_id', 'email', 'name', 'phone', 'location', 'created_at']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for user in users:
            writer.writerow(dict(user))
    
    print(f"\n✅ Users exported to: {filename}")
    conn.close()
    
    return filename

if __name__ == "__main__":
    import sys
    
    try:
        if len(sys.argv) > 1:
            if sys.argv[1] == "search":
                search_user(sys.argv[2] if len(sys.argv) > 2 else None)
            elif sys.argv[1] == "export":
                export_users_to_csv()
        else:
            view_users()
            view_recent_sessions()
            
            print("\n" + "="*100)
            print("OPTIONS:")
            print("  - Run 'python3 view_users.py search [email]' to search for a specific user")
            print("  - Run 'python3 view_users.py export' to export all users to CSV")
            print("="*100)
            
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")