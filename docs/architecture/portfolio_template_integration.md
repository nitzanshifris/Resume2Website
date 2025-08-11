# Portfolio Template Integration Guide

## Overview

This guide explains how to use the RESUME2WEBSITE portfolio template integration to transform CV data into a beautiful, interactive portfolio website.

## Architecture

The integration consists of:

1. **Template Data Transformer** (`services/portfolio/template_data_transformer.py`)
   - Transforms CV data from unified schema to template-specific format
   - Handles data mapping, formatting, and enhancement
   - Generates customized portfolio pages

2. **API Endpoints** (`api/routes/portfolio.py`)
   - `/portfolio/generate-template` - Generate portfolio from CV data
   - `/portfolio/generate-from-cv` - Upload CV and generate portfolio
   - `/portfolio/transform-data` - Preview data transformation
   - `/portfolio/download/{id}` - Download generated portfolio

3. **Portfolio Template** (`final_template/`)
   - Next.js application with TypeScript
   - Editable components with live preview
   - Dark/light theme support
   - Section visibility toggles

## Usage

### 1. Via API

#### Generate Portfolio from CV Data

```bash
curl -X POST http://localhost:8000/api/v1/portfolio/generate-template \
  -H "Content-Type: application/json" \
  -d '{
    "cv_data": {
      "hero": {
        "fullName": "John Doe",
        "professionalTitle": "Software Engineer"
      },
      "contact": {
        "email": "john@example.com",
        "phone": "555-0123"
      }
    },
    "user_name": "John Doe"
  }'
```

#### Generate Portfolio from CV File

```bash
curl -X POST http://localhost:8000/api/v1/portfolio/generate-from-cv \
  -F "file=@resume.pdf" \
  -F "user_name=John Doe"
```

#### Preview Data Transformation

```bash
curl -X POST http://localhost:8000/api/v1/portfolio/transform-data \
  -H "Content-Type: application/json" \
  -d '{"cv_data": {...}}'
```

### 2. Via Command Line

```bash
# Transform CV JSON to portfolio
python scripts/generate_portfolio_from_json.py cv_data.json

# Preview transformation only
python scripts/generate_portfolio_from_json.py cv_data.json --preview

# Specify output directory
python scripts/generate_portfolio_from_json.py cv_data.json -o my-portfolio
```

### 3. Programmatically

```python
from services.portfolio.template_data_transformer import template_transformer

# Transform CV data
cv_data = {...}  # Your CV data following unified schema
template_data = template_transformer.transform_cv_to_template(cv_data)

# Generate portfolio page
template_transformer.generate_portfolio_page(cv_data, output_path="portfolio/page.tsx")
```

## Data Transformation

### Hero Section

CV Data:
```json
{
  "hero": {
    "fullName": "Michelle Lopez",
    "professionalTitle": "Senior Fashion Designer & Creative Director"
  }
}
```

Transformed:
```json
{
  "hero": {
    "name": "Michelle Lopez",
    "subTitle": "Senior Fashion",
    "flipWords": ["Designer", "Director"]
  }
}
```

### Experience Section

CV Data:
```json
{
  "experience": {
    "experienceItems": [{
      "jobTitle": "Senior Designer",
      "companyName": "Fashion House",
      "location": {"city": "Milan", "country": "Italy"},
      "dateRange": {"startDate": "2020", "endDate": "2023"},
      "responsibilitiesAndAchievements": [
        "Led design team",
        "Increased sales by 40%"
      ]
    }]
  }
}
```

Transformed:
```json
{
  "experience": {
    "title": "Career Milestones",
    "items": [{
      "title": "Senior Designer",
      "company": "Fashion House",
      "location": "Milan, Italy, 2020 — 2023",
      "details": "Led design team. Increased sales by 40%"
    }]
  }
}
```

### Skills Section

CV Data:
```json
{
  "skills": {
    "skillCategories": [{
      "categoryName": "Programming Languages",
      "skills": ["Python", "JavaScript", "TypeScript"]
    }]
  }
}
```

Transformed:
```json
{
  "skills": {
    "title": "Areas of Expertise",
    "items": [{
      "title": "Programming Languages",
      "description": "Proficient in Python, JavaScript, TypeScript",
      "icon": "DraftingCompass"
    }]
  }
}
```

## Template Features

### Editable Content
- Click any text to edit it inline
- Changes are saved automatically
- Markdown support for rich text

### Theme Support
- Light and dark themes
- Automatic theme detection
- Manual theme toggle

### Section Management
- Toggle sections on/off
- Reorder sections (coming soon)
- Custom section titles

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions

### Animations
- Smooth transitions
- Flip word animations
- Scroll-based reveals

## Deployment

The generated portfolio is a standard Next.js application ready for deployment:

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Deploy with zero config

### Self-hosting
1. Build: `npm run build`
2. Start: `npm start`
3. Serve on port 3000

### Static Export
1. Build: `npm run build`
2. Export: `npm run export`
3. Serve the `out` directory

## Customization

### Modify Template
Edit files in `final_template/`:
- `app/page.tsx` - Main page component
- `components/ui/` - UI components
- `styles/globals.css` - Global styles

### Add New Sections
1. Update transformer to handle new data
2. Add section to template
3. Map data fields appropriately

### Change Styling
- Edit Tailwind classes
- Modify theme configuration
- Update component styles

## Troubleshooting

### Common Issues

1. **Template not found**
   - Ensure `final_template/` exists
   - Check file permissions

2. **Data transformation fails**
   - Validate CV data structure
   - Check for required fields

3. **Portfolio generation timeout**
   - Reduce data size
   - Check system resources

### Debug Mode

Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## API Reference

### POST /portfolio/generate-template

Generate portfolio from CV data.

**Request:**
```json
{
  "cv_data": {...},
  "user_name": "John Doe",
  "template_type": "final_template"
}
```

**Response:**
```json
{
  "success": true,
  "portfolio_id": "template-20231215-123456",
  "download_url": "/portfolio/download/template-20231215-123456",
  "preview_data": {...}
}
```

### POST /portfolio/generate-from-cv

Upload CV file and generate portfolio.

**Request:**
- Form data with file upload
- Optional: user_name field

**Response:**
Same as generate-template

### POST /portfolio/transform-data

Preview data transformation without generating files.

**Request:**
```json
{
  "cv_data": {...}
}
```

**Response:**
```json
{
  "success": true,
  "template_data": {...}
}
```

## Examples

See `tests/test_template_transformer.py` for comprehensive examples of data transformation.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review test cases
3. Open an issue on GitHub