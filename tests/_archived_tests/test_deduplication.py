#!/usr/bin/env python3
"""
Test the smart deduplication service
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.local.smart_deduplicator import smart_deduplicator

def test_deduplication():
    """Test various duplication scenarios"""
    print("Testing Smart Deduplication")
    print("=" * 60)
    
    # Test cases with semantic duplicates
    test_achievements = [
        ("Reduced customer churn by 15% through targeted retention campaigns", "experience@TechCorp"),
        ("Increased sales revenue by $2.5M in Q4 2023", "summary"),
        ("Decreased customer attrition by 15% using retention strategies", "achievements"),
        ("Boosted sales revenue by $2.5M in Q4 2023", "experience@TechCorp"),
        ("Led a team of 8 software engineers", "experience@StartupXYZ"),
        ("Managed 8 software developers in an agile environment", "experience@StartupXYZ"),
        ("Improved application performance by 40%", "projects@OptimizationProject"),
        ("Enhanced app performance by 40% through optimization", "achievements"),
    ]
    
    print(f"\nOriginal items: {len(test_achievements)}")
    for text, source in test_achievements:
        print(f"  - [{source}] {text[:60]}...")
    
    # Run deduplication
    results = smart_deduplicator.deduplicate_achievements(test_achievements)
    
    print(f"\nDeduplicated to: {len(results)} unique items")
    print("\nResults:")
    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result['text']}")
        print(f"   Sources: {', '.join(result['sources'])}")
        print(f"   Similar items found: {result['similar_count']}")
        if result['metrics']:
            print(f"   Metrics: {', '.join(result['metrics'])}")
    
    # Test similarity calculation
    print("\n" + "=" * 60)
    print("Testing similarity calculation:")
    
    test_pairs = [
        ("Reduced costs by 20%", "Decreased costs by 20%"),
        ("Led a team of 5 engineers", "Managed 5 software developers"),
        ("Increased revenue by $1M", "Boosted sales by $1M"),
        ("Implemented REST API", "Built RESTful APIs"),
        ("Completely different achievement", "Nothing similar here"),
    ]
    
    for text1, text2 in test_pairs:
        similarity = smart_deduplicator.calculate_similarity(text1, text2)
        print(f"\nSimilarity: {similarity:.2f}")
        print(f"  '{text1}'")
        print(f"  '{text2}'")
        print(f"  → {'DUPLICATE' if similarity >= 0.85 else 'UNIQUE'}")

if __name__ == "__main__":
    test_deduplication()