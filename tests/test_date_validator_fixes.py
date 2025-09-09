"""Test the date validator fixes"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.cv_extraction.date_validator import DateValidator

def test_date_parsing():
    """Test improved date parsing"""
    dv = DateValidator()
    
    # Test regular dates
    assert dv.parse_date("2021-05") == (2021, 5)
    assert dv.parse_date("May 2021") == (2021, 5)
    assert dv.parse_date("05/2021") == (2021, 5)
    assert dv.parse_date("2021") == (2021, 1)
    
    # Test month with dot (Sept.)
    result = dv.parse_date("Sept. 2019")
    assert result == (2019, 9), f"Expected (2019, 9), got {result}"
    
    # Test present/current with trailing punctuation
    assert dv.parse_date("Present.") == (dv.current_year, dv.current_month)
    assert dv.parse_date("current,") == (dv.current_year, dv.current_month)
    assert dv.parse_date("NOW;") == (dv.current_year, dv.current_month)
    
    print("✅ Date parsing tests passed")

def test_overlap_message():
    """Test improved overlap message"""
    dv = DateValidator()
    
    item1 = {
        'dateRange': {
            'startDate': 'Jan 2020',
            'endDate': 'Dec 2020'
        }
    }
    
    item2 = {
        'dateRange': {
            'startDate': 'Jun 2020',
            'endDate': 'Present'
        }
    }
    
    overlap = dv.check_date_overlap(item1, item2)
    assert overlap is not None
    assert "Jan 2020 to Dec 2020" in overlap
    assert "Jun 2020 to Present" in overlap
    
    print("✅ Overlap message test passed")

def test_safe_iter_usage():
    """Test that validate functions handle None/non-dict items"""
    dv = DateValidator()
    
    # Test with None items mixed in
    cv_data = {
        'experience': {
            'experienceItems': [
                None,
                {'jobTitle': 'Engineer', 'dateRange': {'startDate': '2020'}},
                "invalid string",
                {'jobTitle': 'Manager', 'dateRange': {'startDate': '2021'}},
                None
            ]
        }
    }
    
    # Should not crash
    issues = dv.validate_experience_dates(cv_data)
    assert isinstance(issues, list)
    
    print("✅ Safe iteration test passed")

def test_suspicious_tech_fix():
    """Test the logic fix for _remove_suspicious_tech"""
    dv = DateValidator()
    
    cv_data = {
        'experience': {
            'experienceItems': [
                {
                    'jobTitle': 'Fashion Designer',
                    'companyName': 'Fashion House',
                    'technologiesUsed': ['React', 'Photoshop']
                }
            ]
        }
    }
    
    # Detect the suspicious tech
    issues = dv.detect_hallucinations(cv_data)
    assert len(issues) > 0
    assert issues[0]['type'] == 'suspicious_technology'
    
    # Now remove it (the fix ensures this runs when issues exist)
    cv_data = dv._remove_suspicious_tech(cv_data, issues)
    
    # React should be removed, Photoshop kept
    techs = cv_data['experience']['experienceItems'][0].get('technologiesUsed', [])
    assert 'React' not in techs
    assert 'Photoshop' in techs
    
    print("✅ Suspicious tech removal test passed")

def test_single_day_degree():
    """Test single-day degree detection"""
    dv = DateValidator()
    
    cv_data = {
        'education': {
            'educationItems': [
                {
                    'degree': 'Bachelor of Science',
                    'dateRange': {
                        'startDate': 'May 2020',
                        'endDate': 'May 2020'  # Same day
                    }
                }
            ]
        }
    }
    
    issues = dv.validate_education_dates(cv_data)
    
    # Should detect single-day degree
    single_day_issues = [i for i in issues if i['type'] == 'single_day_degree']
    assert len(single_day_issues) == 1
    
    print("✅ Single-day degree test passed")

if __name__ == "__main__":
    test_date_parsing()
    test_overlap_message()
    test_safe_iter_usage()
    test_suspicious_tech_fix()
    test_single_day_degree()
    print("\n✅ All date validator fixes verified!")