# CV2WEB Specifications

> "The new scarce skill is writing specifications that fully capture intent and values" - Sean, OpenAI

## What This Is

Following Sean's "specifications as code" methodology, this directory contains the **primary artifacts** that define CV2WEB's intentions, values, and behavior. The code is a secondary downstream artifact of these specifications.

## Core Principle

**Specifications align humans first, then models.** These documents serve as the universal artifact that aligns all humans (technical, product, legal, safety) on shared intentions and values.

## Structure

### Core Specifications
- `core-intent.md` - Our fundamental values and mission (like OpenAI's model spec)
- `success-criteria.md` - Measurable outcomes that define success

### Domain Specifications
- `user-intent/` - What users want to achieve and why
- `cv-processing/` - How we handle CV extraction and data processing  
- `portfolio-quality/` - Standards for generated portfolios
- `user-experience/` - Journey and interaction principles
- `business-logic/` - Rules, constraints, and behaviors

### Test Cases
- `test-cases/` - Challenging scenarios for each specification clause

## ID System

Each specification clause has a unique ID:
- `CI##` - Core Intent clauses
- `UI##` - User Intent clauses  
- `CV##` - CV Processing clauses
- `PQ##` - Portfolio Quality clauses
- `UX##` - User Experience clauses
- `BL##` - Business Logic clauses

## Usage

1. **For Humans**: Debate, discuss, and align on these specifications
2. **For Models**: Feed specifications as context for consistent behavior
3. **For Testing**: Verify implementations against success criteria
4. **For Evolution**: Version control changes and maintain changelog

## Contributing

All team members can contribute to specifications:
- Engineers understand technical constraints
- Product managers know user needs
- Designers understand experience requirements
- Business stakeholders define success metrics

**Remember**: Engineering is "the precise exploration by humans of software solutions to human problems" - these specifications define the problems and intended solutions.