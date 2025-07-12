"""
Portfolio Template Data Transformer
Transforms CVData schema to final_template expected format
"""
import json
import logging
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

from src.core.schemas.unified import CVData

logger = logging.getLogger(__name__)


class TemplateDataTransformer:
    """Transforms CV data to match the final_template structure"""
    
    def __init__(self):
        self.default_flip_words = ["Professional", "Expert", "Specialist", "Leader"]
        self.icon_mapping = {
            "technical": "DraftingCompass",
            "creative": "Palette",
            "management": "Layers",
            "soft": "Lightbulb",
            "tools": "SwatchBook",
            "achievement": "Award"
        }
    
    def transform_cv_to_template(self, cv_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform CV data to template format
        
        Args:
            cv_data: Dictionary following CVData schema
            
        Returns:
            Dictionary matching final_template expected structure
        """
        try:
            # Initialize template data structure
            template_data = {
                "hero": self._transform_hero(cv_data.get("hero"), cv_data.get("summary")),
                "professionalSummary": self._transform_summary(cv_data.get("summary")),
                "experience": self._transform_experience(cv_data.get("experience")),
                "projects": self._transform_projects(cv_data.get("projects")),
                "skills": self._transform_skills(cv_data.get("skills")),
                "education": self._transform_education(cv_data.get("education")),
                "courses": self._transform_courses(cv_data.get("courses"), cv_data.get("certifications")),
                "publications": self._transform_publications(cv_data.get("publications")),
                "speakingEngagements": self._transform_speaking(cv_data.get("speaking")),
                "volunteer": self._transform_volunteer(cv_data.get("volunteer")),
                "languages": self._transform_languages(cv_data.get("languages")),
                "contact": self._transform_contact(cv_data.get("contact"), cv_data.get("hero"))
            }
            
            # Remove None values
            template_data = {k: v for k, v in template_data.items() if v is not None}
            
            return template_data
            
        except Exception as e:
            logger.error(f"Error transforming CV data: {e}")
            raise
    
    def _transform_hero(self, hero_data: Optional[Dict], summary_data: Optional[Dict]) -> Dict[str, Any]:
        """Transform hero section data"""
        if not hero_data:
            hero_data = {}
        
        name = hero_data.get("fullName", "Professional")
        title = hero_data.get("professionalTitle", "")
        
        # Extract flip words from professional title
        flip_words = self._extract_flip_words(title)
        
        # Extract subtitle (base title without the rotating words)
        sub_title = self._extract_subtitle(title, flip_words)
        
        return {
            "name": name,
            "subTitle": sub_title,
            "flipWords": flip_words
        }
    
    def _extract_flip_words(self, title: str) -> List[str]:
        """Extract rotating words from professional title"""
        if not title:
            return self.default_flip_words
        
        # Common patterns for flip words
        patterns = [
            r"(\w+)\s*[/&,]\s*(\w+)(?:\s*[/&,]\s*(\w+))?",  # Designer/Developer/Creator
            r"(?:Senior\s+)?(\w+)\s+(?:and|&)\s+(\w+)",  # Designer and Developer
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title)
            if match:
                words = [w for w in match.groups() if w]
                return [w.capitalize() for w in words]
        
        # Extract key role words
        role_words = ["Designer", "Developer", "Engineer", "Manager", "Architect", 
                      "Consultant", "Specialist", "Analyst", "Creator", "Expert",
                      "Visionary", "Innovator", "Leader", "Strategist"]
        
        found_words = []
        for word in role_words:
            if word.lower() in title.lower():
                found_words.append(word)
        
        return found_words[:4] if found_words else self.default_flip_words
    
    def _extract_subtitle(self, title: str, flip_words: List[str]) -> str:
        """Extract base subtitle without flip words"""
        if not title:
            return "A"
        
        # Remove flip words from title to get base
        subtitle = title
        for word in flip_words:
            subtitle = re.sub(rf"\b{re.escape(word)}\b", "", subtitle, flags=re.IGNORECASE)
        
        # Clean up extra spaces and punctuation
        subtitle = re.sub(r"\s*[/&,]\s*", " ", subtitle)
        subtitle = re.sub(r"\s+", " ", subtitle).strip()
        
        # If nothing left, return "A" as default
        return subtitle if subtitle else "A"
    
    def _transform_summary(self, summary_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform professional summary section"""
        if not summary_data:
            return None
        
        summary_text = summary_data.get("summaryText", "")
        if not summary_text:
            # Build from career highlights if available
            highlights = summary_data.get("careerHighlights", [])
            if highlights:
                summary_text = " ".join(highlights[:2])
        
        return {
            "title": "Professional Summary",
            "content": summary_text
        }
    
    def _transform_experience(self, exp_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform experience section"""
        if not exp_data or not exp_data.get("experienceItems"):
            return None
        
        items = []
        for exp in exp_data["experienceItems"]:
            # Format location string
            location_str = self._format_location_with_dates(
                exp.get("location"),
                exp.get("dateRange")
            )
            
            # Combine responsibilities into details
            responsibilities = exp.get("responsibilitiesAndAchievements", [])
            details = " ".join(responsibilities[:2]) if responsibilities else exp.get("summary", "")
            
            items.append({
                "title": exp.get("jobTitle", "Position"),
                "company": exp.get("companyName", "Company"),
                "location": location_str,
                "details": details
            })
        
        return {
            "title": exp_data.get("sectionTitle", "Career Milestones"),
            "items": items[:4]  # Limit to 4 for template
        }
    
    def _format_location_with_dates(self, location: Optional[Dict], date_range: Optional[Dict]) -> str:
        """Format location with date range"""
        parts = []
        
        # Add location
        if location:
            loc_parts = []
            if location.get("city"):
                loc_parts.append(location["city"])
            if location.get("state"):
                loc_parts.append(location["state"])
            if location.get("country") and location["country"] != "United States":
                loc_parts.append(location["country"])
            
            if loc_parts:
                parts.append(", ".join(loc_parts))
        
        # Add date range
        if date_range:
            start = self._format_date(date_range.get("startDate"))
            end = "Present" if date_range.get("isCurrent") else self._format_date(date_range.get("endDate"))
            
            if start:
                date_str = f"{start} — {end}" if end else start
                parts.append(date_str)
        
        return ", ".join(parts) if parts else "Location not specified"
    
    def _format_date(self, date_str: Optional[str]) -> Optional[str]:
        """Format date string to year only"""
        if not date_str:
            return None
        
        # Try to extract year
        year_match = re.search(r'\b(19|20)\d{2}\b', date_str)
        if year_match:
            return year_match.group()
        
        return date_str
    
    def _transform_projects(self, projects_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform projects section"""
        if not projects_data or not projects_data.get("projectItems"):
            return None
        
        items = []
        for proj in projects_data["projectItems"]:
            items.append({
                "title": proj.get("title", "Project"),
                "description": proj.get("description", ""),
                "link": proj.get("projectUrl", "#"),
                "icon": "Lightbulb"  # Default icon
            })
        
        return {
            "title": projects_data.get("sectionTitle", "Selected Works"),
            "items": items[:4]  # Limit to 4 for template
        }
    
    def _transform_skills(self, skills_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform skills section"""
        if not skills_data:
            return None
        
        items = []
        
        # Process skill categories
        if skills_data.get("skillCategories"):
            for category in skills_data["skillCategories"][:4]:  # Limit to 4
                # Determine icon based on category name
                icon = self._get_skill_icon(category.get("categoryName", ""))
                
                # Join skills into description
                skills = category.get("skills", [])
                description = f"Proficient in {', '.join(skills[:3])}" if skills else ""
                if len(skills) > 3:
                    description += f" and {len(skills) - 3} more"
                
                items.append({
                    "title": category.get("categoryName", "Skills"),
                    "description": description,
                    "icon": icon
                })
        
        # Add ungrouped skills if no categories
        elif skills_data.get("ungroupedSkills"):
            skills = skills_data["ungroupedSkills"]
            items.append({
                "title": "Technical Skills",
                "description": f"Expertise in {', '.join(skills[:5])}",
                "icon": "DraftingCompass"
            })
        
        return {
            "title": skills_data.get("sectionTitle", "Areas of Expertise"),
            "items": items
        }
    
    def _get_skill_icon(self, category_name: str) -> str:
        """Get appropriate icon for skill category"""
        category_lower = category_name.lower()
        
        if any(word in category_lower for word in ["programming", "technical", "development"]):
            return "DraftingCompass"
        elif any(word in category_lower for word in ["design", "creative", "ui", "ux"]):
            return "Palette"
        elif any(word in category_lower for word in ["framework", "library", "tool"]):
            return "SwatchBook"
        elif any(word in category_lower for word in ["management", "leadership", "soft"]):
            return "Layers"
        else:
            return "Lightbulb"
    
    def _transform_education(self, edu_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform education section"""
        if not edu_data or not edu_data.get("educationItems"):
            return None
        
        items = []
        for edu in edu_data["educationItems"]:
            # Build description from relevant coursework or honors
            description_parts = []
            
            if edu.get("relevantCoursework"):
                # Check for dissertation
                for course in edu["relevantCoursework"]:
                    if "dissertation" in course.lower():
                        description_parts.append(course)
                        break
                else:
                    description_parts.append(f"Relevant coursework: {', '.join(edu['relevantCoursework'][:2])}")
            
            if edu.get("honors"):
                description_parts.append(f"Honors: {', '.join(edu['honors'])}")
            
            if edu.get("gpa"):
                description_parts.append(f"GPA: {edu['gpa']}")
            
            description = " ".join(description_parts[:2]) if description_parts else \
                         f"Developed expertise in {edu.get('fieldOfStudy', 'field')}"
            
            # Format years
            years = self._format_education_years(edu.get("dateRange"))
            
            items.append({
                "title": edu.get("institution", "University"),
                "degree": edu.get("degree", "Degree"),
                "years": years,
                "description": description
            })
        
        return {
            "title": edu_data.get("sectionTitle", "Academic Provenance"),
            "items": items[:3]  # Limit to 3 for template
        }
    
    def _format_education_years(self, date_range: Optional[Dict]) -> str:
        """Format education date range"""
        if not date_range:
            return ""
        
        start = self._format_date(date_range.get("startDate"))
        end = "Present" if date_range.get("isCurrent") else self._format_date(date_range.get("endDate"))
        
        if start and end:
            return f"{start} - {end}"
        elif start:
            return start
        else:
            return ""
    
    def _transform_courses(self, courses_data: Optional[Dict], cert_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform courses and certifications"""
        items = []
        
        # Add certifications first
        if cert_data and cert_data.get("certificationItems"):
            for cert in cert_data["certificationItems"][:2]:
                items.append({
                    "title": cert.get("title", "Certification"),
                    "description": cert.get("issuingOrganization", ""),
                    "icon": "Award"
                })
        
        # Add courses
        if courses_data and courses_data.get("courseItems"):
            for course in courses_data["courseItems"][:2]:
                items.append({
                    "title": course.get("title", "Course"),
                    "description": course.get("issuingOrganization", ""),
                    "icon": "Award"
                })
        
        if not items:
            return None
        
        return {
            "title": "Professional Development",
            "items": items[:4]  # Limit to 4
        }
    
    def _transform_publications(self, pub_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform publications section"""
        if not pub_data or not pub_data.get("publications"):
            return None
        
        items = []
        for pub in pub_data["publications"]:
            # Format outlet/journal
            outlet = pub.get("journalName") or pub.get("conferenceName") or "Publication"
            
            # Format date
            date = self._format_date(pub.get("publicationDate")) or "Recent"
            
            items.append({
                "title": pub.get("title", "Publication"),
                "outlet": outlet,
                "date": date,
                "link": pub.get("publicationUrl", "#")
            })
        
        return {
            "title": pub_data.get("sectionTitle", "Press & Publications"),
            "items": items[:4]  # Limit to 4
        }
    
    def _transform_speaking(self, speaking_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform speaking engagements"""
        if not speaking_data or not speaking_data.get("speakingEngagements"):
            return None
        
        items = []
        for event in speaking_data["speakingEngagements"]:
            # Format date
            date = self._format_date(event.get("date")) or "Recent"
            
            items.append({
                "event": event.get("eventName", "Speaking Event"),
                "topic": event.get("topic", "Presentation"),
                "date": date,
                "link": event.get("eventUrl") or event.get("presentationUrl", "#")
            })
        
        return {
            "title": speaking_data.get("sectionTitle", "Industry Engagements"),
            "items": items[:4]  # Limit to 4
        }
    
    def _transform_volunteer(self, volunteer_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform volunteer experience"""
        if not volunteer_data or not volunteer_data.get("volunteerItems"):
            return None
        
        items = []
        for vol in volunteer_data["volunteerItems"]:
            # Combine description and responsibilities
            description_parts = []
            if vol.get("description"):
                description_parts.append(vol["description"])
            if vol.get("responsibilities"):
                description_parts.extend(vol["responsibilities"][:1])
            
            description = " ".join(description_parts) if description_parts else \
                         "Contributing to community initiatives"
            
            items.append({
                "organization": vol.get("organization", "Organization"),
                "role": vol.get("role", "Volunteer"),
                "description": description
            })
        
        return {
            "title": "Community & Advocacy",
            "items": items[:4]  # Limit to 4
        }
    
    def _transform_languages(self, lang_data: Optional[Dict]) -> Optional[Dict[str, Any]]:
        """Transform languages section"""
        if not lang_data or not lang_data.get("languageItems"):
            return None
        
        items = []
        for lang in lang_data["languageItems"]:
            items.append({
                "language": lang.get("language", "Language"),
                "proficiency": lang.get("proficiency", "Proficient")
            })
        
        return {
            "title": lang_data.get("sectionTitle", "Languages"),
            "items": items
        }
    
    def _transform_contact(self, contact_data: Optional[Dict], hero_data: Optional[Dict]) -> Dict[str, Any]:
        """Transform contact section"""
        if not contact_data:
            contact_data = {}
        
        # Get name from hero if not in contact
        name = hero_data.get("fullName", "Professional") if hero_data else "Professional"
        
        # Extract year for copyright
        current_year = datetime.now().year
        
        return {
            "title": "Let's Connect",
            "subtitle": contact_data.get("availability", "Available for collaborations and new projects."),
            "phone": contact_data.get("phone", "(555) 123-4567"),
            "email": contact_data.get("email", "contact@example.com"),
            "copyright": f"© {current_year} {name}. All Rights Reserved."
        }
    
    def generate_portfolio_page(self, cv_data: Dict[str, Any], output_path: Optional[Path] = None) -> str:
        """
        Generate complete portfolio page with transformed data
        
        Args:
            cv_data: CV data dictionary
            output_path: Optional path to write the file
            
        Returns:
            Generated TypeScript content
        """
        # Transform the data
        template_data = self.transform_cv_to_template(cv_data)
        
        # Read the template file
        template_path = Path(__file__).parent.parent.parent / "final_template" / "app" / "page.tsx"
        
        if not template_path.exists():
            raise FileNotFoundError(f"Template file not found at {template_path}")
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        # Find the initialData object and replace it
        import_end = template_content.find("const initialData")
        if import_end == -1:
            raise ValueError("Could not find initialData in template")
        
        # Find the end of initialData
        data_start = import_end
        brace_count = 0
        data_end = data_start
        started = False
        
        for i, char in enumerate(template_content[data_start:], data_start):
            if char == '{' and not started:
                started = True
                brace_count = 1
            elif started:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        data_end = i + 1
                        break
        
        # Generate new data section
        json_data = json.dumps(template_data, indent=2, ensure_ascii=False)
        # Convert to TypeScript object literal
        ts_data = re.sub(r'"(\w+)":', r'\1:', json_data)
        
        new_data_section = f"const initialData = {ts_data}"
        
        # Replace the data section
        new_content = (
            template_content[:import_end] +
            new_data_section +
            template_content[data_end:]
        )
        
        # Write to output path if provided
        if output_path:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            logger.info(f"Generated portfolio page at {output_path}")
        
        return new_content


# Create singleton instance
template_transformer = TemplateDataTransformer()