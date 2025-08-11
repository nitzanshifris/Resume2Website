#!/usr/bin/env python3
"""
View CV data associated with users in the CV2WEB database
"""
import sqlite3
import json
from datetime import datetime

def view_user_cvs():
    """Display all users and their associated CVs"""
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("\n" + "="*100)
    print("USER CV DATA ASSOCIATIONS")
    print("="*100)
    
    # Get all users with their CV counts
    cursor.execute("""
        SELECT 
            u.user_id,
            u.email,
            u.name,
            u.created_at,
            COUNT(c.upload_id) as cv_count,
            MAX(c.upload_date) as last_cv_upload
        FROM users u
        LEFT JOIN cv_uploads c ON u.user_id = c.user_id
        GROUP BY u.user_id
        ORDER BY u.created_at DESC
    """)
    
    users = cursor.fetchall()
    
    print(f"\nTotal Users: {len(users)}")
    print("-"*100)
    
    for user in users:
        print(f"\n📧 Email: {user['email']}")
        print(f"   Name: {user['name'] or 'Not provided'}")
        print(f"   User ID: {user['user_id']}")
        print(f"   Account Created: {user['created_at']}")
        print(f"   CVs Uploaded: {user['cv_count']}")
        
        if user['cv_count'] > 0:
            print(f"   Last CV Upload: {user['last_cv_upload']}")
            
            # Get CV details for this user
            cursor.execute("""
                SELECT 
                    job_id,
                    filename,
                    file_type,
                    upload_date,
                    status,
                    CASE 
                        WHEN cv_data IS NOT NULL THEN 'Yes'
                        ELSE 'No'
                    END as has_extracted_data
                FROM cv_uploads
                WHERE user_id = ?
                ORDER BY upload_date DESC
            """, (user['user_id'],))
            
            cvs = cursor.fetchall()
            
            print(f"\n   📄 CV Details:")
            for cv in cvs:
                print(f"      - {cv['filename']}")
                print(f"        Job ID: {cv['job_id']}")
                print(f"        Type: {cv['file_type']}")
                print(f"        Status: {cv['status']}")
                print(f"        Data Extracted: {cv['has_extracted_data']}")
                print(f"        Uploaded: {cv['upload_date']}")
        else:
            print(f"   ❌ No CVs uploaded yet")
    
    conn.close()

def view_cv_data(job_id=None):
    """View detailed extracted CV data for a specific job"""
    if not job_id:
        job_id = input("\nEnter Job ID to view CV data: ")
    
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            c.*,
            u.email,
            u.name as user_name
        FROM cv_uploads c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.job_id = ?
    """, (job_id,))
    
    cv = cursor.fetchone()
    
    if cv:
        print("\n" + "="*100)
        print(f"CV DATA FOR JOB: {job_id}")
        print("="*100)
        
        print(f"\n📧 User: {cv['email']} ({cv['user_name'] or 'No name'})")
        print(f"📄 File: {cv['filename']}")
        print(f"📅 Uploaded: {cv['upload_date']}")
        print(f"✅ Status: {cv['status']}")
        
        if cv['cv_data']:
            try:
                cv_data = json.loads(cv['cv_data'])
                print(f"\n📊 Extracted Data Sections:")
                
                # Show which sections have data
                for section, data in cv_data.items():
                    if data:
                        if isinstance(data, dict):
                            has_content = any(v for v in data.values() if v)
                        elif isinstance(data, list):
                            has_content = len(data) > 0
                        else:
                            has_content = bool(data)
                        
                        if has_content:
                            print(f"   ✅ {section}")
                            
                            # Show sample data for key sections
                            if section == 'hero' and isinstance(data, dict):
                                if data.get('fullName'):
                                    print(f"      Name: {data.get('fullName')}")
                                if data.get('professionalTitle'):
                                    print(f"      Title: {data.get('professionalTitle')}")
                            elif section == 'contact' and isinstance(data, dict):
                                if data.get('email'):
                                    print(f"      Email: {data.get('email')}")
                                if data.get('phone'):
                                    print(f"      Phone: {data.get('phone')}")
                            elif section == 'experience' and isinstance(data, list):
                                print(f"      Jobs: {len(data)} positions")
                            elif section == 'education' and isinstance(data, list):
                                print(f"      Degrees: {len(data)} entries")
                            elif section == 'skills' and isinstance(data, dict):
                                total_skills = 0
                                if data.get('skillCategories'):
                                    for cat in data['skillCategories']:
                                        if cat.get('skills'):
                                            total_skills += len(cat['skills'])
                                if data.get('ungroupedSkills'):
                                    total_skills += len(data['ungroupedSkills'])
                                print(f"      Total Skills: {total_skills}")
            except json.JSONDecodeError:
                print("\n❌ Error: CV data is not valid JSON")
        else:
            print("\n❌ No extracted CV data found")
    else:
        print(f"\n❌ No CV found with Job ID: {job_id}")
    
    conn.close()

def check_orphan_cvs():
    """Check for CVs without user associations (should be none)"""
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("\n" + "="*100)
    print("ORPHAN CV CHECK")
    print("="*100)
    
    # Check for CVs with invalid user_ids
    cursor.execute("""
        SELECT c.job_id, c.filename, c.user_id, c.upload_date
        FROM cv_uploads c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE u.user_id IS NULL
    """)
    
    orphans = cursor.fetchall()
    
    if orphans:
        print(f"\n⚠️ Found {len(orphans)} orphan CVs without valid users:")
        for cv in orphans:
            print(f"   - {cv['filename']} (Job ID: {cv['job_id']}, User ID: {cv['user_id']})")
    else:
        print("\n✅ All CVs are properly associated with valid users!")
    
    conn.close()

def get_user_statistics():
    """Get statistics about user CV associations"""
    conn = sqlite3.connect('data/cv2web.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("\n" + "="*100)
    print("USER-CV STATISTICS")
    print("="*100)
    
    # Users with most CVs
    cursor.execute("""
        SELECT 
            u.email,
            u.name,
            COUNT(c.upload_id) as cv_count
        FROM users u
        JOIN cv_uploads c ON u.user_id = c.user_id
        GROUP BY u.user_id
        HAVING cv_count > 0
        ORDER BY cv_count DESC
        LIMIT 5
    """)
    
    top_users = cursor.fetchall()
    
    print("\n📊 Top Users by CV Count:")
    for user in top_users:
        print(f"   {user['cv_count']} CVs - {user['email']} ({user['name'] or 'No name'})")
    
    # Success rate
    cursor.execute("""
        SELECT 
            status,
            COUNT(*) as count
        FROM cv_uploads
        GROUP BY status
    """)
    
    statuses = cursor.fetchall()
    
    print("\n📈 CV Processing Status:")
    total = sum(s['count'] for s in statuses)
    for status in statuses:
        percentage = (status['count'] / total) * 100 if total > 0 else 0
        print(f"   {status['status']}: {status['count']} ({percentage:.1f}%)")
    
    # Recent CV uploads
    cursor.execute("""
        SELECT 
            c.filename,
            u.email,
            c.upload_date,
            c.status
        FROM cv_uploads c
        JOIN users u ON c.user_id = u.user_id
        ORDER BY c.upload_date DESC
        LIMIT 5
    """)
    
    recent = cursor.fetchall()
    
    print("\n🕐 Recent CV Uploads:")
    for cv in recent:
        print(f"   {cv['filename']} by {cv['email']} ({cv['status']}) - {cv['upload_date']}")
    
    conn.close()

if __name__ == "__main__":
    import sys
    
    try:
        if len(sys.argv) > 1:
            if sys.argv[1] == "data":
                view_cv_data(sys.argv[2] if len(sys.argv) > 2 else None)
            elif sys.argv[1] == "orphans":
                check_orphan_cvs()
            elif sys.argv[1] == "stats":
                get_user_statistics()
        else:
            view_user_cvs()
            check_orphan_cvs()
            get_user_statistics()
            
            print("\n" + "="*100)
            print("ADDITIONAL OPTIONS:")
            print("  - Run 'python3 view_user_cvs.py data [job_id]' to view detailed CV data")
            print("  - Run 'python3 view_user_cvs.py orphans' to check for orphan CVs")
            print("  - Run 'python3 view_user_cvs.py stats' to see statistics only")
            print("="*100)
            
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")