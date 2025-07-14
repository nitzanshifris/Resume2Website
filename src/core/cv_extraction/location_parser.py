"""
Location Parser for CV Data
Handles parsing of various location formats into structured data
"""
import re
from typing import Optional, Dict, Tuple
from src.core.schemas.unified_nullable import Location

# US state abbreviations
US_STATES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
}

# Create reverse mapping for state names
US_STATES_REVERSE = {v: k for k, v in US_STATES.items()}

# Common US cities with their states (for better location inference)
US_CITIES = {
    'Seattle': 'Washington',
    'Chicago': 'Illinois', 
    'New York': 'New York',
    'Los Angeles': 'California',
    'San Francisco': 'California',
    'San Diego': 'California',
    'San Jacinto': 'California',
    'Boston': 'Massachusetts',
    'Miami': 'Florida',
    'Houston': 'Texas',
    'Dallas': 'Texas',
    'Austin': 'Texas',
    'Phoenix': 'Arizona',
    'Philadelphia': 'Pennsylvania',
    'Philipsburg': 'Pennsylvania',
    'Denver': 'Colorado',
    'Portland': 'Oregon',
    'Las Vegas': 'Nevada',
    'Atlanta': 'Georgia',
    'Washington': 'District of Columbia',
    'Newtown Square': 'Pennsylvania',
    'Philipsburg': 'Pennsylvania',  # There's also one in Montana, but PA is more common
    'Princeton': 'New Jersey',
    'Cambridge': 'Massachusetts'
}

# Common international cities with their countries
INTERNATIONAL_CITIES = {
    'Milan': 'Italy',
    'Milano': 'Italy',
    'Rome': 'Italy',
    'Paris': 'France',
    'London': 'United Kingdom',
    'Berlin': 'Germany',
    'Tokyo': 'Japan',
    'Minato': 'Japan',  # Tokyo ward, commonly appears in addresses
    'Beijing': 'China',
    'Mumbai': 'India',
    'Toronto': 'Canada',
    'Vancouver': 'Canada',
    'Sydney': 'Australia',
    'Melbourne': 'Australia',
    'Dubai': 'United Arab Emirates',
    'Singapore': 'Singapore',
    'Hong Kong': 'Hong Kong',
    'Online': None,  # Special case for online/remote
    'Remote': None  # Special case for remote work
}

# Common country names and variations
COUNTRIES = {
    'USA', 'United States', 'United States of America', 'US', 'U.S.', 'U.S.A.',
    'Canada', 'CA', 'CAN',
    'United Kingdom', 'UK', 'U.K.', 'Britain', 'Great Britain',
    'Australia', 'AU', 'AUS',
    'Germany', 'DE', 'Deutschland',
    'France', 'FR',
    'Japan', 'JP', 'JPN',
    'China', 'CN', 'CHN',
    'India', 'IN', 'IND',
    'Brazil', 'BR', 'BRA',
    'Mexico', 'MX', 'MEX',
    'Spain', 'ES', 'ESP',
    'Italy', 'IT', 'ITA',
    'Netherlands', 'NL', 'NLD', 'Holland',
    'Sweden', 'SE', 'SWE',
    'Switzerland', 'CH', 'CHE',
    'Singapore', 'SG', 'SGP',
    'Israel', 'IL', 'ISR',
    'South Korea', 'Korea', 'KR', 'KOR',
    'Russia', 'RU', 'RUS',
    'South Africa', 'ZA', 'RSA'
}

def is_us_state(text: str) -> bool:
    """Check if text is a US state name or abbreviation"""
    if not text:
        return False
    text = text.strip()
    return text in US_STATES or text in US_STATES.values()

def normalize_country(country_str: str) -> str:
    """Normalize country name to standard format"""
    if not country_str:
        return None
        
    country_str = country_str.strip()
    
    # Check if it's a US state first (should not be treated as country)
    if is_us_state(country_str):
        return None
    
    # Case-insensitive match with canonical form preservation
    country_lower = country_str.lower()
    
    # Define canonical forms for common variations
    canonical_forms = {
        'usa': 'United States',
        'us': 'United States',
        'u.s.': 'United States',
        'u.s.a.': 'United States',
        'united states': 'United States',
        'united states of america': 'United States',
        'uk': 'United Kingdom',
        'u.k.': 'United Kingdom',
        'britain': 'United Kingdom',
        'great britain': 'United Kingdom',
        'deutschland': 'Germany',
        'holland': 'Netherlands',
        'korea': 'South Korea',
        'rsa': 'South Africa'
    }
    
    # Check canonical forms first
    if country_lower in canonical_forms:
        return canonical_forms[country_lower]
    
    # Then check exact matches in COUNTRIES set
    for country in COUNTRIES:
        if country.lower() == country_lower:
            # Return the exact form from the set (preserves capitalization)
            return country
    
    # Return original if no match found
    return country_str

def parse_location_string(location_str: str) -> Location:
    """
    Parse various location string formats into structured Location object
    
    Examples:
    - "Los Angeles, CA"
    - "Seattle, WA, USA"
    - "London, United Kingdom"
    - "1515 PACIFIC AVE, LOS ANGELES, CA 90291, UNITED STATES"
    """
    if not location_str:
        return Location()
    
    # Clean up the string
    location_str = location_str.strip()
    
    # Try to parse full address format
    # Pattern: [Street], City, State [Zip], [Country]
    full_address_pattern = r'^(.*?),\s*([^,]+),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?),?\s*(.+)?$'
    match = re.match(full_address_pattern, location_str)
    if match:
        street, city, state, zip_code, country = match.groups()
        return Location(
            city=city.strip(),
            state=US_STATES.get(state, state),
            country=normalize_country(country) if country else 'United States'
        )
    
    # Split by comma
    parts = [p.strip() for p in location_str.split(',')]
    
    # Remove empty parts
    parts = [p for p in parts if p]
    
    if len(parts) == 0:
        return Location()
    
    location = Location()
    
    # Try to identify components
    for i, part in enumerate(parts):
        # Check if it's a US state abbreviation
        if part in US_STATES:
            location.state = US_STATES[part]
            # Previous part is likely the city
            if i > 0 and not location.city:
                location.city = parts[i-1]
            # If US state found, assume USA unless specified otherwise
            if not location.country:
                location.country = 'United States'
        # Check if it's a ZIP code
        elif re.match(r'^\d{5}(?:-\d{4})?$', part):
            # Skip ZIP codes for now
            continue
        # Check if it's a country
        elif normalize_country(part):
            location.country = normalize_country(part)
        # Check if it's a state name (not abbreviation)
        elif part in US_STATES.values():
            location.state = part
            if i > 0 and not location.city:
                location.city = parts[i-1]
            if not location.country:
                location.country = 'United States'
        # Check if it's a known US city
        elif part in US_CITIES:
            location.city = part
            if not location.state:
                location.state = US_CITIES[part]
            if not location.country:
                location.country = 'United States'
        # Check if it's a known international city
        elif part in INTERNATIONAL_CITIES:
            location.city = part
            if not location.country and INTERNATIONAL_CITIES[part]:
                location.country = INTERNATIONAL_CITIES[part]
        # Otherwise, it might be a city
        elif not location.city and i == 0:
            location.city = part
    
    # Special handling for single-word locations (e.g., "Seattle", "Milan")
    if len(parts) == 1:
        single_part = parts[0]
        # Check if it's a known city first
        if single_part in US_CITIES:
            location.city = single_part
            location.state = US_CITIES[single_part]
            location.country = 'United States'
        elif single_part in INTERNATIONAL_CITIES:
            location.city = single_part
            if INTERNATIONAL_CITIES[single_part]:
                location.country = INTERNATIONAL_CITIES[single_part]
        # Check if it's a US state
        elif single_part in US_STATES:
            location.state = US_STATES[single_part]
            location.country = 'United States'
        elif single_part in US_STATES.values():
            location.state = single_part
            location.country = 'United States'
        # Check if it's a known country
        elif normalize_country(single_part) and single_part not in US_STATES.values():
            location.country = normalize_country(single_part)
        else:
            # Unknown single word - assume it's a city, not a country
            location.city = single_part
            # Don't set country - better to have none than wrong
    
    # Handle common patterns
    elif len(parts) == 2:
        # Pattern: "City, State" or "City, Country"
        location.city = parts[0]
        # Check if second part is a US state
        if parts[1] in US_STATES:
            location.state = US_STATES[parts[1]]
            location.country = 'United States'
        elif parts[1] in US_STATES.values():
            location.state = parts[1]
            location.country = 'United States'
        elif parts[1] in US_CITIES:
            # Second part is another US city, not a state
            location.state = US_CITIES.get(parts[1])
            location.country = 'United States'
        elif parts[1] in INTERNATIONAL_CITIES:
            # Second part is an international city
            location.country = INTERNATIONAL_CITIES.get(parts[1])
        else:
            # Only treat as country if it's not a US state
            normalized = normalize_country(parts[1])
            if normalized:  # normalize_country returns None for US states
                location.country = normalized
            # else: leave country empty instead of setting city as country
    
    elif len(parts) == 3:
        # Pattern: "City, State, Country"
        if not location.city:
            location.city = parts[0]
        if not location.state and parts[1] in US_STATES:
            location.state = US_STATES[parts[1]]
        elif not location.state:
            location.state = parts[1]
        if not location.country:
            location.country = normalize_country(parts[2])
    
    elif len(parts) >= 4:
        # Complex address - take city, state, country from end
        # Assuming format: [Street parts...], City, State, [ZIP], Country
        for i in range(len(parts) - 1, -1, -1):
            part = parts[i]
            if not location.country and normalize_country(part):
                location.country = normalize_country(part)
            elif not location.state and (part in US_STATES or part in US_STATES.values()):
                location.state = US_STATES.get(part, part)
            elif not location.city and i < len(parts) - 2:
                location.city = part
                break
    
    # Final check: if we have only a city name, check if we can infer state/country
    if location.city and not location.country:
        if location.city in US_CITIES:
            if not location.state:
                location.state = US_CITIES[location.city]
            location.country = 'United States'
        elif location.city in INTERNATIONAL_CITIES and INTERNATIONAL_CITIES[location.city]:
            location.country = INTERNATIONAL_CITIES[location.city]
    
    # Critical fix: Never allow a city to be set as country
    if location.country and location.city:
        # If country equals city, it's likely a parsing error
        if location.country == location.city:
            # Try to infer the real country
            if location.city in US_CITIES:
                location.country = 'United States'
                if not location.state:
                    location.state = US_CITIES[location.city]
            elif location.city in INTERNATIONAL_CITIES:
                if INTERNATIONAL_CITIES[location.city]:
                    location.country = INTERNATIONAL_CITIES[location.city]
                else:
                    location.country = None  # Better to have no country than wrong country
            else:
                # Unknown city - better to have no country than city as country
                location.country = None
    
    # Also check if state equals city (another common error)
    if location.state and location.city and location.state == location.city:
        # Try to fix it
        if location.city in US_CITIES:
            location.state = US_CITIES[location.city]
        else:
            location.state = None
    
    return location


def parse_year_range(text: str) -> Tuple[Optional[int], Optional[str]]:
    """
    Parse expressions like "more than 9 years" to extract years of experience
    
    NOTE: This function should ideally be moved to a separate text parsing module
    as it's not specifically related to location parsing, but is kept here
    temporarily for convenience.
    
    Returns:
        Tuple of (years, qualifier) where qualifier can be "exact", "more_than", "approximately", etc.
    """
    if not text:
        return None, None
    
    text = text.lower().strip()
    
    # Pattern: "more than X years"
    match = re.search(r'more\s+than\s+(\d+)\s*\+?\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "over X years"
    match = re.search(r'over\s+(\d+)\s*\+?\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "X+ years"
    match = re.search(r'(\d+)\s*\+\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "approximately X years"
    match = re.search(r'(?:approximately|approx\.?|about|around)\s+(\d+)\s*years?', text)
    if match:
        return int(match.group(1)), "approximately"
    
    # Pattern: "X years"
    match = re.search(r'(\d+)\s*years?', text)
    if match:
        return int(match.group(1)), "exact"
    
    return None, None