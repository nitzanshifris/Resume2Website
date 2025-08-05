"""
Advanced Section Classification for CV Data
Fixes critical cross-section contamination issues in CV extraction
"""
import logging
import re
from typing import Dict, Any, List, Tuple, Set
from collections import defaultdict

logger = logging.getLogger(__name__)

# Section Classification Priority Matrix
SECTION_PRIORITY_MATRIX = {
    # Languages - highest priority for language names
    'languages': {
        'keywords': [
            'english', 'spanish', 'french', 'german', 'mandarin', 'cantonese', 
            'portuguese', 'italian', 'japanese', 'korean', 'arabic', 'russian', 
            'hindi', 'dutch', 'swedish', 'norwegian', 'danish', 'chinese',
            'hebrew', 'finnish', 'polish', 'hungarian', 'czech', 'greek',
            'turkish', 'vietnamese', 'thai', 'indonesian', 'malay', 'filipino',
            'tagalog', 'urdu', 'bengali', 'tamil', 'telugu', 'marathi',
            'gujarati', 'punjabi', 'swahili', 'afrikaans', 'zulu', 'xhosa'
        ],
        'patterns': [
            r'\b\w+\s+(language|native|fluent|conversational|basic|elementary|intermediate|advanced|proficient)\b',
            r'\b(native|fluent|conversational|basic)\s+\w+\b',
            r'\b\w+\s*\((native|fluent|conversational|basic|elementary|intermediate|advanced)\)',
            r'\b(mother\s+tongue|first\s+language|second\s+language)\b'
        ],
        'negative_patterns': [  # Don't classify these as languages
            r'\bprogramming\s+language\b',
            r'\bscripting\s+language\b',
            r'\bmarkup\s+language\b',
            r'\bquery\s+language\b'
        ],
        'priority': 100
    },
    
    # Certifications - high priority for certification patterns
    'certifications': {
        'keywords': [
            'certified', 'certification', 'license', 'accredited', 'credential',
            'diploma', 'certificate', 'chartered', 'registered', 'licensed'
        ],
        'patterns': [
            r'\b(AWS|Azure|GCP|Google\s+Cloud)\s+Certified\b',
            r'\bCompTIA\s+\w+\b',
            r'\bMicrosoft\s+Certified\b',
            r'\bCisco\s+(CCNA|CCNP|CCIE|CCENT)\b',
            r'\b(PMP|CAPM|CSM|CSPO|PSM|CSP)\b',
            r'\b\w+\s+Certified\s+\w+\b',
            r'\bCertified\s+\w+\s+(Professional|Associate|Expert|Specialist)\b',
            r'\b(CISSP|CISA|CISM|CEH|OSCP|GIAC)\b',
            r'\b(CPA|CFA|FRM|PRM)\b',
            r'\b(ITIL|PRINCE2|Six\s+Sigma)\b',
            r'\b(Salesforce|Oracle|SAP)\s+Certified\b',
            r'\b(Red\s+Hat|VMware|Citrix)\s+Certified\b'
        ],
        'priority': 90
    },
    
    # Skills - medium priority, catches technical skills
    'skills': {
        'keywords': [
            'programming', 'development', 'framework', 'technology', 'software', 
            'tool', 'platform', 'methodology', 'protocol', 'database',
            'library', 'api', 'architecture', 'design', 'testing', 'debugging'
        ],
        'patterns': [
            r'\b(Python|JavaScript|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|Perl|R|MATLAB)\b',
            r'\b(React|Angular|Vue|Node\.js|Django|Flask|Express|Spring|Laravel|Rails)\b',
            r'\b(AWS|Azure|Docker|Kubernetes|Git|Linux|Unix|Windows|MacOS)\b',
            r'\b(MySQL|PostgreSQL|MongoDB|Redis|Oracle|SQL\s+Server|Cassandra|Neo4j)\b',
            r'\b(HTML|CSS|SASS|LESS|Bootstrap|Tailwind)\b',
            r'\b(REST|GraphQL|SOAP|JSON|XML|YAML)\b',
            r'\b(Apache|Nginx|IIS|Tomcat|Jenkins|Gradle|Maven|NPM|Yarn)\b',
            r'\b(TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy|OpenCV)\b'
        ],
        'priority': 50
    }
}

class AdvancedSectionClassifier:
    """Advanced classifier to prevent cross-section contamination in CV data"""
    
    def __init__(self):
        self.classification_rules = SECTION_PRIORITY_MATRIX
        self.item_assignments = {}  # Track where items are assigned
        
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        if not text:
            return ""
        return text.lower().strip()
    
    def classify_item(self, item_text: str, candidate_sections: List[str]) -> str:
        """Determine the best section for an item based on content analysis"""
        if not item_text or not candidate_sections:
            return candidate_sections[0] if candidate_sections else 'skills'
            
        scores = {}
        normalized_text = self.normalize_text(item_text)
        
        for section in candidate_sections:
            if section not in self.classification_rules:
                continue
                
            rules = self.classification_rules[section]
            score = 0
            
            # Check negative patterns first (exclusions)
            if 'negative_patterns' in rules:
                for pattern in rules['negative_patterns']:
                    if re.search(pattern, item_text, re.IGNORECASE):
                        score = -1000  # Strong negative score
                        break
            
            if score >= 0:  # Only proceed if not excluded
                # Keyword matching
                for keyword in rules['keywords']:
                    if keyword in normalized_text:
                        score += 10
                
                # Pattern matching
                for pattern in rules['patterns']:
                    if re.search(pattern, item_text, re.IGNORECASE):
                        score += 20
                
                # Apply priority weight
                scores[section] = score * (rules['priority'] / 100)
        
        # Return section with highest score
        if scores:
            best_section = max(scores.keys(), key=lambda x: scores[x])
            if scores[best_section] > 0:
                logger.debug(f"Classified '{item_text}' → {best_section} (score: {scores[best_section]:.2f})")
                return best_section
        
        # Default to first candidate section if no clear match
        return candidate_sections[0] if candidate_sections else 'skills'
    
    def deduplicate_across_sections(self, cv_data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """Remove duplicates across all CV sections AND fix misclassified items within sections"""
        all_items = {}  # normalized_text -> {sections: [], original: str}
        
        # Collect all items from relevant sections
        section_mappings = {
            'skills': self._extract_skills_items,
            'certifications': self._extract_certification_items,
            'languages': self._extract_language_items
        }
        
        for section_name, extractor in section_mappings.items():
            if cv_data.get(section_name):
                items = extractor(cv_data[section_name])
                for item in items:
                    if item and len(item.strip()) > 1:
                        normalized = self.normalize_text(item)
                        if normalized not in all_items:
                            all_items[normalized] = {'sections': [], 'original': item}
                        all_items[normalized]['sections'].append(section_name)
        
        # Classify each item (including single-section items that might be misclassified)
        duplicates_fixed = 0
        moves_made = []
        
        for normalized_text, info in all_items.items():
            # Determine the best section for this item
            all_candidate_sections = ['skills', 'certifications', 'languages']
            best_section = self.classify_item(info['original'], all_candidate_sections)
            
            # Check if item is in wrong sections
            current_sections = info['sections']
            
            if len(current_sections) > 1:
                # Multiple sections: remove from all except best
                sections_to_remove = [s for s in current_sections if s != best_section]
                logger.info(f"📍 Cross-section duplicate: Moving '{info['original']}' from {sections_to_remove} → {best_section}")
                
                for section in sections_to_remove:
                    self._remove_item_from_section(cv_data, section, info['original'])
                    duplicates_fixed += 1
                    
                moves_made.append({
                    'item': info['original'],
                    'from': sections_to_remove,
                    'to': best_section,
                    'type': 'cross-section duplicate'
                })
                
            elif len(current_sections) == 1:
                # Single section: check if it's in the wrong section
                current_section = current_sections[0]
                if current_section != best_section:
                    # Item is misclassified, move it to correct section
                    logger.info(f"📍 Misclassified item: Moving '{info['original']}' from {current_section} → {best_section}")
                    
                    # Remove from wrong section
                    self._remove_item_from_section(cv_data, current_section, info['original'])
                    
                    # Add to correct section
                    self._add_item_to_section(cv_data, best_section, info['original'])
                    duplicates_fixed += 1
                    
                    moves_made.append({
                        'item': info['original'],
                        'from': [current_section],
                        'to': best_section,
                        'type': 'misclassification fix'
                    })
        
        if moves_made:
            move_descriptions = [f"{m['item']} ({m['type']})" for m in moves_made]
            logger.warning(f"🔧 Fixed {duplicates_fixed} classification issues: {move_descriptions}")
        
        return cv_data, duplicates_fixed
    
    def _extract_skills_items(self, skills_section: Dict[str, Any]) -> List[str]:
        """Extract all skill items from skills section"""
        items = []
        if skills_section.get('skillCategories'):
            for category in skills_section['skillCategories']:
                if category.get('skills'):
                    items.extend(category['skills'])
        if skills_section.get('ungroupedSkills'):
            items.extend(skills_section['ungroupedSkills'])
        return [item for item in items if item and item.strip()]
    
    def _extract_certification_items(self, certifications_section: Dict[str, Any]) -> List[str]:
        """Extract all certification titles from certifications section"""
        items = []
        if certifications_section.get('certificationItems'):
            for cert in certifications_section['certificationItems']:
                if cert.get('title'):
                    items.append(cert['title'])
        return [item for item in items if item and item.strip()]
    
    def _extract_language_items(self, languages_section: Dict[str, Any]) -> List[str]:
        """Extract all language names from languages section"""
        items = []
        if languages_section.get('languageItems'):
            for lang in languages_section['languageItems']:
                if lang.get('language'):
                    items.append(lang['language'])
        return [item for item in items if item and item.strip()]
    
    def _remove_item_from_section(self, cv_data: Dict, section_name: str, item_text: str):
        """Remove specific item from a section"""
        normalized_target = self.normalize_text(item_text)
        
        if section_name == 'skills' and cv_data.get('skills', {}).get('skillCategories'):
            for category in cv_data['skills']['skillCategories']:
                if 'skills' in category:
                    original_count = len(category['skills'])
                    category['skills'] = [
                        s for s in category['skills'] 
                        if self.normalize_text(s) != normalized_target
                    ]
                    if len(category['skills']) < original_count:
                        logger.debug(f"Removed '{item_text}' from skills category '{category.get('categoryName', 'Unknown')}'")
        
        elif section_name == 'certifications' and cv_data.get('certifications', {}).get('certificationItems'):
            original_count = len(cv_data['certifications']['certificationItems'])
            cv_data['certifications']['certificationItems'] = [
                cert for cert in cv_data['certifications']['certificationItems']
                if self.normalize_text(cert.get('title', '')) != normalized_target
            ]
            if len(cv_data['certifications']['certificationItems']) < original_count:
                logger.debug(f"Removed '{item_text}' from certifications")
        
        elif section_name == 'languages' and cv_data.get('languages', {}).get('languageItems'):
            original_count = len(cv_data['languages']['languageItems'])
            cv_data['languages']['languageItems'] = [
                lang for lang in cv_data['languages']['languageItems']
                if self.normalize_text(lang.get('language', '')) != normalized_target
            ]
            if len(cv_data['languages']['languageItems']) < original_count:
                logger.debug(f"Removed '{item_text}' from languages")
    
    def _add_item_to_section(self, cv_data: Dict, section_name: str, item_text: str):
        """Add item to appropriate section"""
        if section_name == 'skills':
            # Add to skills section
            if not cv_data.get('skills'):
                cv_data['skills'] = {'sectionTitle': 'Skills', 'skillCategories': []}
            if not cv_data['skills'].get('skillCategories'):
                cv_data['skills']['skillCategories'] = []
            
            # Find or create appropriate category
            if any(keyword in item_text.lower() for keyword in ['certified', 'certification']):
                category_name = 'Certifications & Licenses'
            elif any(keyword in item_text.lower() for keyword in ['programming', 'python', 'javascript', 'java']):
                category_name = 'Programming Languages'
            else:
                category_name = 'Technical Skills'
            
            # Find existing category or create new one
            target_category = None
            for category in cv_data['skills']['skillCategories']:
                if category.get('categoryName') == category_name:
                    target_category = category
                    break
            
            if not target_category:
                target_category = {'categoryName': category_name, 'skills': []}
                cv_data['skills']['skillCategories'].append(target_category)
            
            if item_text not in target_category['skills']:
                target_category['skills'].append(item_text)
                logger.debug(f"Added '{item_text}' to skills category '{category_name}'")
        
        elif section_name == 'certifications':
            # Add to certifications section
            if not cv_data.get('certifications'):
                cv_data['certifications'] = {'sectionTitle': 'Certifications', 'certificationItems': []}
            if not cv_data['certifications'].get('certificationItems'):
                cv_data['certifications']['certificationItems'] = []
            
            # Create certification item
            cert_item = {
                'title': item_text,
                'issuingOrganization': None,
                'issueDate': None,
                'expirationDate': None,
                'credentialId': None,
                'verificationUrl': None
            }
            
            # Check if already exists
            existing_titles = [cert.get('title', '') for cert in cv_data['certifications']['certificationItems']]
            if item_text not in existing_titles:
                cv_data['certifications']['certificationItems'].append(cert_item)
                logger.debug(f"Added '{item_text}' to certifications")
        
        elif section_name == 'languages':
            # Add to languages section
            if not cv_data.get('languages'):
                cv_data['languages'] = {'sectionTitle': 'Languages', 'languageItems': []}
            if not cv_data['languages'].get('languageItems'):
                cv_data['languages']['languageItems'] = []
            
            # Create language item
            lang_item = {
                'language': item_text,
                'proficiency': None,
                'certification': None
            }
            
            # Check if already exists
            existing_languages = [lang.get('language', '') for lang in cv_data['languages']['languageItems']]
            if item_text not in existing_languages:
                cv_data['languages']['languageItems'].append(lang_item)
                logger.debug(f"Added '{item_text}' to languages")
    
    def validate_section_classification(self, cv_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Validate that items are in appropriate sections"""
        issues = {
            'language_in_skills': [],
            'certification_in_skills': [],
            'skill_in_languages': [],
            'programming_lang_in_languages': []
        }
        
        # Check for common languages in skills
        common_languages = {lang.lower() for lang in SECTION_PRIORITY_MATRIX['languages']['keywords']}
        if cv_data.get('skills', {}).get('skillCategories'):
            for category in cv_data['skills']['skillCategories']:
                for skill in category.get('skills', []):
                    skill_normalized = self.normalize_text(skill)
                    if skill_normalized in common_languages:
                        issues['language_in_skills'].append(skill)
        
        # Check for certification keywords in skills
        cert_keywords = ['certified', 'certification', 'comptia', 'aws certified', 'microsoft certified']
        if cv_data.get('skills', {}).get('skillCategories'):
            for category in cv_data['skills']['skillCategories']:
                for skill in category.get('skills', []):
                    if any(keyword in self.normalize_text(skill) for keyword in cert_keywords):
                        issues['certification_in_skills'].append(skill)
        
        # Check for programming languages in languages section
        programming_langs = ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift']
        languages_section = cv_data.get('languages') or {}
        if languages_section and languages_section.get('languageItems'):
            for lang_item in languages_section['languageItems']:
                lang_name = self.normalize_text(lang_item.get('language', ''))
                if lang_name in programming_langs:
                    issues['programming_lang_in_languages'].append(lang_item.get('language', ''))
        
        return issues
    
    def enhance_cv_data(self, cv_data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """Main entry point for enhanced CV data processing"""
        logger.info("🚀 Starting advanced section classification and deduplication")
        
        # Apply cross-section deduplication
        enhanced_data, duplicates_fixed = self.deduplicate_across_sections(cv_data)
        
        # Validate final classification
        validation_issues = self.validate_section_classification(enhanced_data)
        
        # Create summary report
        report = {
            'duplicates_fixed': duplicates_fixed,
            'validation_issues': validation_issues,
            'total_issues_found': sum(len(issues) for issues in validation_issues.values())
        }
        
        if report['total_issues_found'] > 0:
            logger.warning(f"⚠️ Classification validation found {report['total_issues_found']} remaining issues: {validation_issues}")
        else:
            logger.info("✅ All sections properly classified, no cross-contamination detected")
        
        if duplicates_fixed > 0:
            logger.info(f"✅ Successfully fixed {duplicates_fixed} cross-section duplicate items")
        
        return enhanced_data, report


# Singleton instance
advanced_classifier = AdvancedSectionClassifier()