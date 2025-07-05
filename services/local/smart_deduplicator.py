"""
Smart semantic deduplication service for CV data
Identifies and removes duplicate content across CV sections
"""
import logging
from typing import List, Dict, Any, Tuple, Optional, Set
from difflib import SequenceMatcher
import re
from collections import defaultdict

logger = logging.getLogger(__name__)


class SmartDeduplicator:
    """
    Intelligently identifies and removes duplicate content from CV data
    without heavy ML dependencies. Uses smart heuristics and fuzzy matching.
    """
    
    def __init__(self, similarity_threshold: float = 0.85):
        self.threshold = similarity_threshold
        logger.info(f"SmartDeduplicator initialized with threshold {similarity_threshold}")
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Lowercase
        text = text.lower()
        # Remove punctuation at the end
        text = text.rstrip('.,;:!?')
        # Normalize numbers with units
        text = re.sub(r'(\d+)\s*%', r'\1%', text)
        text = re.sub(r'\$\s*(\d+)', r'$\1', text)
        # Normalize common variations
        replacements = {
            'reduced': 'decrease',
            'increased': 'increase',
            'improved': 'improve',
            'boosted': 'boost',
            'enhanced': 'enhance',
            'decreased': 'decrease',
            'grew': 'grow',
            'raised': 'raise',
            'cut': 'reduce',
            'lowered': 'reduce',
            'shortened': 'reduce',
            'minimized': 'reduce',
            'maximized': 'increase',
            'optimized': 'improve',
            'streamlined': 'improve',
            'automated': 'automate',
            'implemented': 'implement',
            'developed': 'develop',
            'created': 'create',
            'built': 'build',
            'designed': 'design',
            'led': 'lead',
            'managed': 'manage',
            'oversaw': 'oversee',
            'directed': 'direct',
            'coordinated': 'coordinate',
            'team of': 'team',
            'group of': 'team',
            'engineers': 'developer',
            'developers': 'developer',
            'programmers': 'developer',
            'coders': 'developer',
        }
        
        for old, new in replacements.items():
            text = re.sub(r'\b' + old + r'\b', new, text)
        
        return text
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        # Normalize both texts
        norm1 = self.normalize_text(text1)
        norm2 = self.normalize_text(text2)
        
        # Quick exact match check
        if norm1 == norm2:
            return 1.0
        
        # Use SequenceMatcher for fuzzy matching
        similarity = SequenceMatcher(None, norm1, norm2).ratio()
        
        # Boost similarity if key metrics match
        metrics1 = set(re.findall(r'\d+[%$kKmM]?', text1))
        metrics2 = set(re.findall(r'\d+[%$kKmM]?', text2))
        if metrics1 and metrics2 and metrics1 == metrics2:
            similarity = min(1.0, similarity * 1.3)
        
        # Check if the core action and metrics are the same
        words1 = set(norm1.split())
        words2 = set(norm2.split())
        common_words = words1.intersection(words2)
        
        # If they share significant words and metrics, likely duplicates
        if len(common_words) >= min(3, len(words1) // 2, len(words2) // 2) and metrics1 == metrics2:
            similarity = max(similarity, 0.85)
        
        return similarity
    
    def extract_key_info(self, text: str) -> Dict[str, Any]:
        """Extract key information from achievement text"""
        info = {
            'metrics': re.findall(r'\d+[%$kKmM]?', text),
            'action': None,
            'technologies': [],
        }
        
        # Extract action verb (usually first word)
        words = text.split()
        if words:
            info['action'] = self.normalize_text(words[0])
        
        # Extract technologies (common patterns)
        tech_pattern = r'\b(?:Python|JavaScript|React|Node\.?js|Django|AWS|Docker|Kubernetes|SQL|MongoDB|Redis|GraphQL|REST(?:ful)?|API|ML|AI|cloud|microservices?)\b'
        info['technologies'] = re.findall(tech_pattern, text, re.IGNORECASE)
        
        return info
    
    def deduplicate_achievements(self, items_with_provenance: List[Tuple[str, str]]) -> List[Dict[str, Any]]:
        """
        Deduplicate achievements while tracking their sources
        
        Args:
            items_with_provenance: List of (text, source) tuples
            
        Returns:
            List of unique achievements with sources
        """
        if not items_with_provenance:
            return []
        
        # Group similar items
        groups = []
        processed = set()
        
        for i, (text1, source1) in enumerate(items_with_provenance):
            if i in processed:
                continue
                
            group = {
                'items': [(text1, source1)],
                'indices': {i}
            }
            
            # Find all similar items
            for j, (text2, source2) in enumerate(items_with_provenance[i+1:], i+1):
                if j in processed:
                    continue
                    
                similarity = self.calculate_similarity(text1, text2)
                if similarity >= self.threshold:
                    group['items'].append((text2, source2))
                    group['indices'].add(j)
            
            groups.append(group)
            processed.update(group['indices'])
        
        # Select best from each group
        results = []
        for group in groups:
            # Choose the most detailed version (usually longest)
            best_text = max((item[0] for item in group['items']), key=len)
            
            # Collect all sources
            sources = {item[1] for item in group['items']}
            
            # Extract key info for context
            key_info = self.extract_key_info(best_text)
            
            results.append({
                'text': best_text,
                'sources': list(sources),
                'metrics': key_info['metrics'],
                'technologies': key_info['technologies'],
                'similar_count': len(group['items'])
            })
        
        logger.info(f"Deduplication: {len(items_with_provenance)} items → {len(results)} unique items")
        return results
    
    def deduplicate_cv_data(self, cv_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deduplicate entire CV data structure
        
        Args:
            cv_data: The full CV data dictionary
            
        Returns:
            CV data with duplicates removed
        """
        all_achievements = []
        
        # Collect achievements from all sections
        # Experience section
        if cv_data.get('experience') and cv_data['experience'].get('experienceItems'):
            for exp in cv_data['experience']['experienceItems']:
                company = exp.get('companyName', 'Unknown')
                if exp.get('responsibilities'):
                    for resp in exp['responsibilities']:
                        all_achievements.append((resp, f"experience@{company}"))
                if exp.get('achievements'):
                    for ach in exp['achievements']:
                        text = ach if isinstance(ach, str) else ach.get('text', str(ach))
                        all_achievements.append((text, f"experience@{company}"))
        
        # Summary highlights
        if cv_data.get('summary') and cv_data['summary'].get('careerHighlights'):
            for highlight in cv_data['summary']['careerHighlights']:
                all_achievements.append((highlight, "summary"))
        
        # Achievements section
        if cv_data.get('achievements') and cv_data['achievements'].get('achievementItems'):
            for achievement in cv_data['achievements']['achievementItems']:
                if isinstance(achievement, dict):
                    text = achievement.get('achievement', '')
                    all_achievements.append((text, "achievements"))
                else:
                    all_achievements.append((str(achievement), "achievements"))
        
        # Projects section
        if cv_data.get('projects') and cv_data['projects'].get('projectItems'):
            for project in cv_data['projects']['projectItems']:
                if project.get('achievements'):
                    for ach in project['achievements']:
                        all_achievements.append((ach, f"project@{project.get('projectName', 'Unknown')}"))
        
        # Deduplicate
        unique_achievements = self.deduplicate_achievements(all_achievements)
        
        # Create a mapping of sources to deduplicated achievements
        source_to_achievement = defaultdict(list)
        for ach in unique_achievements:
            for source in ach['sources']:
                source_to_achievement[source].append(ach['text'])
        
        # Update CV data with deduplicated content
        # For MVP, just log the duplicates found
        duplicate_count = sum(ach['similar_count'] - 1 for ach in unique_achievements if ach['similar_count'] > 1)
        if duplicate_count > 0:
            logger.warning(f"Found {duplicate_count} duplicate achievements across CV sections")
            
            # Add deduplication report to CV data
            cv_data['_deduplication_report'] = {
                'duplicates_found': duplicate_count,
                'unique_achievements': len(unique_achievements),
                'total_processed': len(all_achievements),
                'duplicate_groups': [
                    {
                        'text': ach['text'],
                        'sources': ach['sources'],
                        'count': ach['similar_count']
                    }
                    for ach in unique_achievements if ach['similar_count'] > 1
                ]
            }
        
        return cv_data


# Singleton instance
smart_deduplicator = SmartDeduplicator()