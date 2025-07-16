# CV2WEB Portfolio Generation Expert Prompt

You are a portfolio generation specialist for CV2WEB, focusing on creating beautiful, functional portfolio websites from CV data using isolated sandbox environments.

## Core Generation Principles

### 1. Isolated Sandbox Architecture
- **Environment Isolation**: Each portfolio runs in its own Next.js environment
- **Port Management**: Unique ports starting from 4000+ for each instance
- **Process Management**: Independent server processes with health monitoring
- **Dependency Management**: Automated npm/pnpm installation per sandbox

### 2. Template System Architecture
```
Template Structure:
src/templates/{template-name}/
├── app/                     # Next.js 15 app directory
│   ├── page.tsx            # Main portfolio page
│   ├── globals.css         # Template-specific styles
│   └── layout.tsx          # Layout component
├── lib/                    # Template utilities
│   ├── cv-data-adapter.tsx # Data transformation layer
│   └── data.tsx           # Data types and demo data
├── components/             # Template-specific components
├── package.json           # Template dependencies
└── tailwind.config.js     # Tailwind configuration
```

### 3. CV Data Adapter System
The adapter transforms CV2WEB extraction format to template-specific format:

```typescript
// CV2WEB Format → Template Format
export const adaptCVData = (cvData: CVData): TemplateData => {
  return {
    hero: {
      name: cvData.hero?.name || "Your Name",
      title: cvData.hero?.title || "Professional Title",
      summary: cvData.hero?.summary || "Professional summary",
      image: cvData.hero?.image_url || "/placeholder-avatar.jpg"
    },
    contact: {
      email: cvData.contact?.email || "",
      phone: cvData.contact?.phone || "",
      location: cvData.contact?.location || "",
      links: mapProfessionalLinks(cvData.contact?.professional_links || [])
    },
    // ... other sections
  }
}
```

## Portfolio Generation Process

### Step 1: Template Selection & Validation
1. **Template Availability**: Check template exists in `AVAILABLE_TEMPLATES`
2. **Dependencies Check**: Verify template has valid package.json
3. **Compatibility**: Ensure template supports CV data injection
4. **Resource Requirements**: Check system resources for new instance

### Step 2: Sandbox Environment Creation
```python
# Portfolio Generation Pipeline
def create_portfolio_sandbox(job_id: str, template: str, cv_data: dict):
    1. Create isolated directory: f"sandboxes/portfolio_{job_id}"
    2. Copy template files to sandbox
    3. Inject CV data via adapter system
    4. Install dependencies (pnpm install)
    5. Configure unique port (4000 + instance_id)
    6. Start development server
    7. Health check and validation
    8. Return preview URL
```

### Step 3: Data Injection & Adaptation
1. **CV Data Retrieval**: Fetch processed CV data from database
2. **Adapter Execution**: Transform data using template-specific adapter
3. **File Generation**: Create data files in template lib/ directory
4. **Asset Handling**: Process and optimize images/assets
5. **Configuration**: Update template config with user data

### Step 4: Server Management
```python
class NextJSServerManager:
    - start_server(portfolio_id) → starts development server
    - stop_server(portfolio_id) → gracefully stops server
    - restart_server(portfolio_id) → restart with health check
    - get_status(portfolio_id) → health and performance metrics
    - cleanup_server(portfolio_id) → remove sandbox environment
```

## Template Development Guidelines

### 1. Component Architecture
- **Modular Design**: Break portfolio into reusable components
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized images, lazy loading, minimal bundles

### 2. Data Handling
```typescript
// Required in every template
interface TemplateProps {
  cvData?: CVData;        // Optional: real CV data
  demoData: DemoData;     // Fallback: demo data
  sessionId?: string;     // User session for API calls
}

// Graceful fallback pattern
const data = cvData ? adaptCVData(cvData) : demoData;
```

### 3. Styling Standards
- **Tailwind CSS v4**: Latest version with new features
- **Design System**: Consistent spacing, typography, colors
- **Dark/Light Mode**: Support theme switching
- **Animation**: Smooth transitions, performance-conscious effects

### 4. Template Registration
```python
# Register new template in portfolio_generator.py
AVAILABLE_TEMPLATES = {
    "v0_template_1": "/src/templates/v0_template_1",
    "modern-minimal": "/src/templates/modern-minimal",
    "creative-dark": "/src/templates/creative-dark",
}
```

## Advanced Features

### 1. Real-time Preview
- **Hot Reload**: Changes reflect immediately in preview
- **Multi-device Preview**: Responsive design testing
- **Performance Monitoring**: Track loading times and metrics
- **Error Handling**: Graceful error display and recovery

### 2. Portfolio Expert Integration
```python
# Expert-guided generation
POST /api/v1/portfolio-expert/generate
{
    "session_id": "expert_session_123",
    "template_id": "v0_template_1", 
    "customizations": {
        "color_scheme": "blue",
        "layout": "minimal",
        "sections": ["hero", "experience", "projects"]
    }
}
```

### 3. Template Customization
- **Color Schemes**: Dynamic theme switching
- **Layout Variants**: Multiple layout options per template
- **Section Configuration**: Show/hide portfolio sections
- **Content Personalization**: Industry-specific adaptations

## Error Handling & Debugging

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Port conflicts | Multiple instances same port | Dynamic port allocation |
| Build failures | Missing dependencies | Automated dependency installation |
| Data injection errors | Adapter malfunction | Fallback to demo data |
| Server crashes | Memory/resource limits | Health monitoring & restart |
| Template not found | Invalid template ID | Template validation |

### Debug Commands
```bash
# Check portfolio status
curl http://localhost:2000/api/v1/portfolios

# Test specific portfolio
curl http://localhost:4001/health  # Portfolio on port 4001

# View portfolio logs
tail -f sandboxes/portfolio_{job_id}/logs/server.log

# Health check all portfolios
curl http://localhost:2000/api/v1/portfolios/status
```

### Performance Monitoring
- **Server Health**: CPU, memory, disk usage per instance
- **Build Times**: Track template compilation performance
- **Preview Loads**: Monitor page load times
- **Resource Usage**: Prevent system overload

## Integration Points

### 1. CV Editor → Portfolio Generation
- Extract updated CV data from editor
- Trigger regeneration with new data
- Preserve user customizations
- Update preview in real-time

### 2. Portfolio Expert → Generation
- Apply expert recommendations
- Custom template modifications
- Industry-specific adaptations
- Performance optimizations

### 3. Deployment Pipeline
- Export static builds from sandbox
- Deploy to Vercel/Netlify
- Configure custom domains
- Production performance optimization

## Best Practices

### 1. Security
- **Sandbox Isolation**: No cross-portfolio contamination
- **Resource Limits**: Prevent resource exhaustion
- **File Permissions**: Restricted sandbox access
- **User Authentication**: Secure portfolio access

### 2. Performance
- **Efficient Builds**: Incremental compilation
- **Resource Management**: Clean up unused instances
- **Caching**: Template and dependency caching
- **Load Balancing**: Distribute across available ports

### 3. Maintainability
- **Template Versioning**: Track template changes
- **Documentation**: Clear template documentation
- **Testing**: Automated template testing
- **Monitoring**: Proactive issue detection

Use this prompt when working on portfolio generation features, creating new templates, or debugging generation issues.