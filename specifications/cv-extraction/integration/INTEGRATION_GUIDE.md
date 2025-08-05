
# CV Extraction Specification Integration Guide

## What Changed
- **Old Approach**: Hard-coded prompts in extraction logic
- **New Approach**: Prompts generated from specifications with measurable quality targets

## Integration Steps

### 1. Update Current Data Extractor
Replace hard-coded prompts in `src/core/cv_extraction/data_extractor.py`:

```python
# OLD: Hard-coded prompt
prompt = "Extract CV data from this text..."

# NEW: Specification-generated prompt
from src.utils.specification_prompt_generator import CVExtractionPromptGenerator
generator = CVExtractionPromptGenerator()
prompts = generator.generate_complete_prompt_set(cv_text)

# Use prompts["system_prompt"] and prompts["extraction_prompt"]
```

### 2. Add Quality Validation
Implement specification-based quality checking:

```python
# Validate extraction meets specification requirements
validation_result = generator.generate_quality_validation_prompt(cv_text, extracted_data)
# Use this to ensure 95%+ accuracy targets are met
```

### 3. Update Claude API Calls
Ensure Claude 4 Opus usage follows specification:

```python
api_params = {
    "model": "claude-4-opus-20250514",  # Specification requirement
    "temperature": 0.0,  # Specification requirement for determinism
    "system": specification_system_prompt,
    "messages": [{"role": "user", "content": specification_extraction_prompt}]
}
```

## Benefits of Specification-Driven Approach

### Measurable Improvements
- **Accuracy Targets**: 98%+ hero section, 95%+ experience/education 
- **Consistency**: Identical CVs produce identical output (temperature 0.0)
- **User Intent Preservation**: Uses candidate's exact language
- **Edge Case Handling**: Systematic handling of dates, overlaps, missing data

### Quality Assurance
- **Specification Compliance**: Each extraction validated against spec
- **Regression Prevention**: Changes tracked against specification requirements
- **Performance Tracking**: Quality metrics align with business goals

### Development Benefits
- **Clear Requirements**: Specifications define exactly what success looks like
- **Easy Updates**: Change specification, regenerate prompts
- **Testing Framework**: Specification provides test cases and success criteria
- **Documentation**: Self-documenting through specification

## Testing the Integration

### 1. Compare Extraction Quality
```python
# Test with real CV examples from data/cv_examples/
old_extraction = current_extractor.extract(cv_text)
new_extraction = specification_extractor.extract(cv_text)

# Compare accuracy, completeness, user intent preservation
```

### 2. Validate Specification Compliance
```python
# Ensure extractions meet specification requirements
validation = validate_against_specification(cv_text, extraction_result)
assert validation["meets_specification"] == True
```

### 3. Performance Benchmarking
- Test extraction speed (should be similar)
- Test accuracy on challenging CVs (should be higher)
- Test consistency (identical input → identical output)

## Migration Strategy

### Phase 1: Parallel Testing
- Run both old and new extraction systems
- Compare results and accuracy
- Validate specification compliance

### Phase 2: Gradual Rollout
- Start with new user CVs
- Monitor quality improvements
- Collect user feedback

### Phase 3: Full Migration
- Replace old extraction system
- Archive old prompts
- Monitor ongoing performance

## Success Metrics
- **Accuracy Improvement**: 5-10% increase in extraction accuracy
- **User Satisfaction**: Higher "this looks correct" ratings
- **Consistency**: 100% identical output for identical input
- **Development Speed**: Faster iteration through specification changes
