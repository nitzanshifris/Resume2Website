# Custom Claude Code Agents Development Plan for Resume2Website V4

## Executive Summary

This document outlines the comprehensive plan for building 13 specialized Claude Code agents tailored for the Resume2Website V4 project. These agents will provide domain-specific expertise, improve development efficiency, and ensure consistent code quality across the platform.

## Project Overview

### Objectives
1. Create specialized agents for specific domains within Resume2Website V4
2. Improve development workflow efficiency and code quality
3. Ensure consistent patterns and best practices across the codebase
4. Provide automated expertise for complex tasks like security, payments, and deployment

### Agent Categories
- **Core Development** (Building, Code Review, Testing)
- **Infrastructure** (Execution & Services, Deployment/CI-CD)
- **Data & Storage** (Schema, Data Extraction)
- **Operations** (Clean Up, Logs & Debug)
- **Business Logic** (Payment, Security)
- **Documentation** (Docs & Specifications)
- **Integration** (External APIs and Services)

## Agent Development Architecture

### 1. File Structure
```
Resume2Website-V4/
├── .claude/
│   ├── agents/
│   │   ├── templates/
│   │   │   └── agent-template.md
│   │   ├── core/
│   │   │   ├── code-review-agent.md
│   │   │   ├── building-agent.md
│   │   │   └── test-agent.md
│   │   ├── infrastructure/
│   │   │   ├── execution-services-agent.md
│   │   │   ├── deployment-cicd-agent.md
│   │   │   └── integration-agent.md
│   │   ├── data/
│   │   │   ├── schema-agent.md
│   │   │   └── data-extraction-agent.md
│   │   ├── operations/
│   │   │   ├── cleanup-organization-agent.md
│   │   │   └── log-debug-agent.md
│   │   ├── business/
│   │   │   ├── payment-agent.md
│   │   │   └── security-agent.md
│   │   └── documentation/
│   │       └── docs-specifications-agent.md
│   └── agent-config.json
```

### 2. Agent Template Structure

Each agent will follow this standardized template:

```markdown
# [Agent Name] Agent

## Identity
- **Purpose**: [One-line description]
- **Model**: [Recommended: Haiku/Sonnet/Opus]
- **Domain**: [Primary area of expertise]
- **Project**: Resume2Website V4

## Core Capabilities
### 1. [Primary Capability]
- [Specific skill/knowledge]
- [Tools and technologies]

### 2. [Secondary Capability]
- [Specific skill/knowledge]
- [Tools and technologies]

## Project Context
### Architecture Knowledge
- [Specific project patterns]
- [Key files and locations]
- [Dependencies and integrations]

### Business Rules
- [Domain-specific rules]
- [Constraints and requirements]

## Tools & Permissions
- **Read Access**: [Specific paths/patterns]
- **Write Access**: [Specific paths/patterns]
- **Execute**: [Specific commands]
- **Restricted**: [What agent cannot do]

## Approach & Methodology
1. [Step 1 in problem-solving]
2. [Step 2 in problem-solving]
3. [Step 3 in problem-solving]

## Output Standards
- Code Style: [Project conventions]
- Documentation: [Required documentation]
- Testing: [Test requirements]
- Logging: [Logging patterns]

## Example Scenarios
### Scenario 1: [Common Use Case]
**Input**: [User request]
**Process**: [How agent handles it]
**Output**: [Expected result]

## Integration Points
- **Collaborates With**: [Other agents]
- **Hands Off To**: [When to delegate]
- **Receives From**: [Input sources]
```

## Detailed Agent Specifications

### 1. Code Review Agent
**Purpose**: Automated code review with project-specific standards
**Model**: Sonnet (balanced analysis)
**Focus Areas**:
- TypeScript/Python code quality
- Resume2Website V4 conventions
- Performance implications
- Security vulnerabilities
- Accessibility compliance

**Special Knowledge**:
- PostCSS configuration requirements
- Sandbox isolation patterns
- CV data structure (18 sections)
- Template architecture

### 2. Execution & Services Agent
**Purpose**: Service management and endpoint execution
**Model**: Sonnet
**Focus Areas**:
- FastAPI routes (`/api/v1/*`)
- Portfolio generation flow
- Service health monitoring
- Port management (2000, 3019, 4000-5000)
- Process lifecycle

**Special Knowledge**:
- Two-stage portfolio process
- Anonymous vs authenticated flows
- Resource limits (20 portfolios, 512MB)
- Auto-cleanup mechanisms

### 3. Clean Up & Organization Agent
**Purpose**: Workspace maintenance and organization
**Model**: Haiku (simple tasks)
**Focus Areas**:
- Build artifact cleanup
- Cache management
- File organization
- Unused dependency removal
- Log rotation

**Special Knowledge**:
- `.next` cache location
- `sandboxes/` temporary files
- `data/generated_portfolios/` cleanup
- 24-hour portfolio retention

### 4. Docs & Specifications Agent
**Purpose**: Documentation and specification management
**Model**: Sonnet
**Focus Areas**:
- CLAUDE.md maintenance
- API documentation
- README updates
- Inline documentation
- Architecture decisions

**Special Knowledge**:
- Project documentation structure
- Markdown conventions
- API endpoint documentation
- Template documentation requirements

### 5. Schema Agent
**Purpose**: Database schema expertise
**Model**: Sonnet
**Focus Areas**:
- SQLite schema
- CV data structure
- User/session models
- Migration patterns
- Query optimization

**Special Knowledge**:
- 18 CV sections schema
- Hash-based deduplication
- Session management
- Portfolio metadata

### 6. Log & Debug Agent
**Purpose**: Debugging and log analysis
**Model**: Opus (complex analysis)
**Focus Areas**:
- Error pattern recognition
- Stack trace analysis
- Performance bottlenecks
- Log correlation
- Root cause analysis

**Special Knowledge**:
- Common error patterns
- FastAPI/Next.js error handling
- Claude API errors
- Vercel deployment issues

### 7. Security Agent
**Purpose**: Security and authentication
**Model**: Opus (critical analysis)
**Focus Areas**:
- Authentication flows
- OAuth implementation
- Data validation
- Secret management
- Permission boundaries

**Special Knowledge**:
- Session-based auth
- Google/LinkedIn OAuth
- API key security
- Resume Gate validation
- File fingerprinting

### 8. Payment Agent
**Purpose**: Stripe integration and payment flows
**Model**: Sonnet
**Focus Areas**:
- Stripe Embedded Checkout
- Payment session management
- Webhook handling
- Test/live mode switching
- Payment confirmation

**Special Knowledge**:
- Stripe API patterns
- Payment flow states
- Portfolio unlock mechanism
- Test card numbers

### 9. Test Agent
**Purpose**: Test creation and execution
**Model**: Sonnet
**Focus Areas**:
- Unit test creation
- Integration testing
- API endpoint testing
- Frontend component testing
- Test coverage analysis

**Special Knowledge**:
- pytest patterns
- Jest/React Testing Library
- CV extraction test cases
- Template testing strategies

### 10. Building Agent
**Purpose**: New feature implementation
**Model**: Opus (complex creation)
**Focus Areas**:
- Feature architecture
- Component creation
- API endpoint development
- Template modifications
- Integration implementation

**Special Knowledge**:
- Project conventions
- Template structure
- API patterns
- Frontend components
- State management

### 11. Data Extraction Agent
**Purpose**: CV data extraction optimization
**Model**: Opus (complex parsing)
**Focus Areas**:
- Claude 4 Opus prompting
- Data structure mapping
- Extraction accuracy
- Template adaptation
- Edge case handling

**Special Knowledge**:
- 18-section structure
- cv-data-adapter patterns
- Confidence scoring
- Circuit breaker logic
- Post-processing rules

### 12. Deployment/CI-CD Agent
**Purpose**: Deployment and continuous integration
**Model**: Sonnet
**Focus Areas**:
- Vercel deployment
- Build optimization
- Environment configuration
- GitHub Actions
- Production monitoring

**Special Knowledge**:
- Vercel CLI integration
- Build flags and options
- Custom domain setup
- Iframe embedding config
- Performance optimization

### 13. Integration Agent
**Purpose**: External service integration
**Model**: Sonnet
**Focus Areas**:
- API integrations
- Webhook management
- SDK implementations
- Third-party services
- Data synchronization

**Special Knowledge**:
- OAuth flows
- Webhook security
- Rate limiting
- Error retry patterns
- API versioning

## Implementation Strategy

### Phase 1: Foundation (Week 1)
1. Create agent template structure
2. Set up agent directory hierarchy
3. Implement agent configuration system
4. Create first 3 core agents (Code Review, Building, Test)
5. Test agent invocation and response patterns

### Phase 2: Core Agents (Week 2)
1. Implement Execution & Services Agent
2. Implement Schema Agent
3. Implement Security Agent
4. Create agent collaboration patterns
5. Test multi-agent workflows

### Phase 3: Specialized Agents (Week 3)
1. Implement Payment Agent
2. Implement Data Extraction Agent
3. Implement Deployment/CI-CD Agent
4. Create specialized tool permissions
5. Test domain-specific capabilities

### Phase 4: Support Agents (Week 4)
1. Implement Clean Up & Organization Agent
2. Implement Log & Debug Agent
3. Implement Docs & Specifications Agent
4. Implement Integration Agent
5. Finalize agent ecosystem

## Agent Configuration Schema

```json
{
  "agents": {
    "code-review": {
      "model": "sonnet",
      "tools": ["Read", "Grep", "Glob"],
      "permissions": {
        "read": ["src/**", "user_web_example/**"],
        "write": [],
        "execute": ["pnpm run typecheck", "pytest"]
      },
      "triggers": ["review", "check code", "analyze"],
      "collaborates_with": ["test-agent", "security-agent"]
    }
  }
}
```

## Best Practices

### 1. Agent Design Principles
- **Single Responsibility**: Each agent focuses on one domain
- **Clear Boundaries**: Well-defined permissions and scope
- **Project Awareness**: Deep knowledge of Resume2Website V4
- **Collaboration Ready**: Can hand off to other agents
- **Output Consistency**: Follows project conventions

### 2. Knowledge Management
- Embed project-specific patterns in each agent
- Include common error scenarios and solutions
- Reference actual file paths and functions
- Maintain awareness of recent changes

### 3. Tool Permissions
- Minimal necessary permissions
- Read-only by default
- Explicit write permissions
- Restricted execution scope
- No overlapping responsibilities

### 4. Testing Strategy
- Test each agent individually
- Test agent collaboration scenarios
- Validate output against project standards
- Measure performance impact
- Ensure security boundaries

## Success Metrics

1. **Development Velocity**: 30% faster feature implementation
2. **Code Quality**: 50% reduction in review iterations
3. **Bug Detection**: 40% earlier bug discovery
4. **Documentation**: 100% coverage of new features
5. **Security**: Zero permission escalation issues

## Maintenance Plan

### Weekly Tasks
- Review agent performance metrics
- Update agent knowledge with new patterns
- Refine collaboration patterns
- Address edge cases discovered

### Monthly Tasks
- Comprehensive agent testing
- Knowledge base updates
- Performance optimization
- Security audit

### Quarterly Tasks
- Agent architecture review
- Model assignment optimization
- Tool permission audit
- Documentation refresh

## Risk Mitigation

### Identified Risks
1. **Over-specialization**: Agents too narrow in scope
   - Mitigation: Regular scope review and adjustment
2. **Knowledge Drift**: Agents become outdated
   - Mitigation: Automated knowledge updates
3. **Permission Creep**: Gradual permission expansion
   - Mitigation: Regular permission audits
4. **Performance Impact**: Too many agent invocations
   - Mitigation: Model optimization and caching

## Next Steps

1. **Immediate Actions**:
   - Create `.claude/agents/` directory structure
   - Develop agent template file
   - Implement Code Review Agent as proof of concept

2. **Short-term Goals** (1-2 weeks):
   - Complete core agent implementations
   - Test agent invocation patterns
   - Document agent usage examples

3. **Long-term Goals** (1 month):
   - Full agent ecosystem deployment
   - Performance optimization
   - Integration with development workflow

## Conclusion

This comprehensive plan provides a structured approach to building 13 specialized Claude Code agents for Resume2Website V4. By following this plan, we will create a powerful ecosystem of AI assistants that understand our specific project needs and can significantly improve development efficiency and code quality.

The modular design allows for incremental implementation while maintaining consistency across all agents. Each agent will be a domain expert in its area while collaborating seamlessly with other agents to handle complex, multi-faceted tasks.

---

*Document Version: 1.0*  
*Last Updated: Current Session*  
*Project: Resume2Website V4*