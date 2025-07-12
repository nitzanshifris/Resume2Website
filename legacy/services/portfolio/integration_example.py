"""
Integration Example: How to use Universal Adapter in existing code
This shows how to replace the if/elif nightmare with clean adapter calls
"""

from universal_adapter import universal_adapter

def old_way_component_selection(component_type: str, cv_data: dict, section: str):
    """
    The OLD WAY - massive if/elif chain (1000+ lines!)
    This is what we're replacing
    """
    if component_type == 'timeline':
        entries = []
        for item in cv_data.get('experience', []):
            entry = {
                'title': item.get('jobTitle') or item.get('position', ''),
                'subtitle': item.get('companyName') or item.get('organization', ''),
                'date': item.get('dateRange') or item.get('duration', ''),
                'content': item.get('description', ''),
            }
            if 'responsibilities' in item:
                entry['bullets'] = item['responsibilities']
            entries.append(entry)
        return {'entries': entries, 'show_icons': True}
    
    elif component_type == 'bento-grid':
        if len(cv_data.get('skills', [])) < 3:
            # Fallback to cards...
            cards = []
            for skill in cv_data.get('skills', []):
                cards.append({
                    'title': skill.get('categoryName', ''),
                    'description': ', '.join(skill.get('skills', []))
                })
            return {'cards': cards}
        else:
            items = []
            for i, skill in enumerate(cv_data.get('skills', [])):
                items.append({
                    'title': skill.get('categoryName', ''),
                    'description': ', '.join(skill.get('skills', [])),
                    'header': f'gradient-{i}',
                    'icon': 'skill-icon'
                })
            return {'items': items}
    
    elif component_type == 'card-hover-effect':
        # Another 30 lines of specific code...
        pass
    
    # ... 40+ more elif statements!
    
def new_way_universal_adapter(component_type: str, cv_data: dict, section: str):
    """
    The NEW WAY - Universal Adapter magic!
    One line replaces 1000+ lines of if/elif code
    """
    return universal_adapter.adapt(component_type, cv_data, section)

# Example usage comparisons
if __name__ == "__main__":
    # Sample CV data
    sample_cv = {
        'experience': [
            {
                'jobTitle': 'Senior Developer',
                'companyName': 'Tech Corp',
                'dateRange': '2020-2023',
                'description': 'Led development team',
                'responsibilities': ['Code review', 'Mentoring', 'Architecture design']
            },
            {
                'position': 'Junior Developer',  # Different field name
                'organization': 'StartupXYZ',   # Different field name
                'duration': '2018-2020',        # Different field name
                'summary': 'Built web applications'
            }
        ],
        'skills': [
            {
                'categoryName': 'Frontend',
                'skills': ['React', 'Vue', 'Angular']
            },
            {
                'categoryName': 'Backend', 
                'skills': ['Python', 'Node.js', 'Java']
            }
        ],
        'projects': [
            {
                'title': 'E-commerce Platform',
                'description': 'Full-stack web application',
                'technologies': 'React • Node.js • MongoDB',
                'projectUrl': 'https://github.com/user/project'
            }
        ],
        'contact': [
            {
                'type': 'email',
                'value': 'john@example.com',
                'url': 'mailto:john@example.com'
            },
            {
                'type': 'linkedin',
                'value': 'LinkedIn Profile',
                'url': 'https://linkedin.com/in/john'
            }
        ]
    }
    
    print("🎯 Universal Adapter Demo\n")
    
    # Test Timeline
    print("1. Timeline Component:")
    timeline_result = universal_adapter.adapt('timeline', sample_cv['experience'], 'experience')
    print(f"   Entries: {len(timeline_result['entries'])}")
    print(f"   First entry: {timeline_result['entries'][0]['title']}")
    print(f"   Has bullets: {'bullets' in timeline_result['entries'][0]}")
    print()
    
    # Test BentoGrid (will fallback to WobbleCard since < 3 items)
    print("2. BentoGrid Component (< 3 items, auto-fallback):")
    bento_result = universal_adapter.adapt('bento-grid', sample_cv['skills'], 'skills')
    print(f"   Result type: {'BentoGrid' if 'items' in bento_result else 'WobbleCard fallback'}")
    print(f"   Cards: {len(bento_result.get('cards', []))}")
    print()
    
    # Test with more skills (will use BentoGrid)
    more_skills = sample_cv['skills'] + [
        {'categoryName': 'Database', 'skills': ['PostgreSQL', 'MongoDB']},
        {'categoryName': 'DevOps', 'skills': ['Docker', 'Kubernetes']}
    ]
    print("3. BentoGrid Component (4+ items):")
    bento_result2 = universal_adapter.adapt('bento-grid', more_skills, 'skills')
    print(f"   Result type: {'BentoGrid' if 'items' in bento_result2 else 'WobbleCard fallback'}")
    print(f"   Items: {len(bento_result2.get('items', []))}")
    print()
    
    # Test CardHoverEffect
    print("4. CardHoverEffect Component:")
    card_result = universal_adapter.adapt('card-hover-effect', sample_cv['projects'], 'projects')
    print(f"   Cards: {len(card_result['cards'])}")
    print(f"   Has link: {bool(card_result['cards'][0]['link'])}")
    print(f"   Tags: {card_result['cards'][0]['tags']}")
    print()
    
    # Test FloatingDock
    print("5. FloatingDock Component:")
    dock_result = universal_adapter.adapt('floating-dock', sample_cv['contact'], 'contact')
    print(f"   Items: {len(dock_result['items'])}")
    print(f"   First icon: {dock_result['items'][0]['icon']}")
    print()
    
    # Test Text Generation
    print("6. TextGenerateEffect Component:")
    text_result = universal_adapter.adapt('text-generate-effect', 
                                        'I am a passionate full-stack developer', 
                                        'summary')
    print(f"   Words: {text_result['words'][:50]}...")
    print()
    
    # Test AnimatedTestimonials (creative use for achievements)
    achievements = [
        {
            'title': 'Employee of the Year',
            'description': 'Outstanding performance and leadership',
            'context': 'Tech Corp 2023'
        }
    ]
    print("7. AnimatedTestimonials (for achievements):")
    testimonial_result = universal_adapter.adapt('animated-testimonials', achievements, 'achievements')
    print(f"   Testimonials: {len(testimonial_result['testimonials'])}")
    print(f"   Quote: {testimonial_result['testimonials'][0]['quote']}")
    print()
    
    print("✅ Universal Adapter successfully handles all components!")
    print("🚀 Ready to replace the if/elif nightmare in portfolio_generator.py")

# Integration with existing portfolio generator
def integrate_with_portfolio_generator():
    """
    Example of how to integrate with existing portfolio_generator.py
    """
    
    # OLD CODE (in portfolio_generator.py):
    """
    def _generate_component_props(self, selection: ComponentSelection) -> Dict:
        component_type = selection.component_type
        cv_data = selection.data
        
        if component_type == 'timeline':
            # 20 lines of code...
        elif component_type == 'bento-grid':
            # 30 lines of code...
        elif component_type == 'card-hover-effect':
            # 25 lines of code...
        # ... 40+ more elif statements
    """
    
    # NEW CODE (replace entire method with):
    def _generate_component_props(self, selection):
        """Generate component props using Universal Adapter"""
        return universal_adapter.adapt(
            selection.component_type,
            selection.data,
            selection.section_type,
            selection.options
        )
    
    print("🎯 Integration Example:")
    print("Replace 1000+ lines of if/elif code with ONE line!")
    print("universal_adapter.adapt(component_type, cv_data, section)")
    
if __name__ == "__main__":
    integrate_with_portfolio_generator()