# Test Case: CV01 - Language Preservation

*Testing exact preservation of user's original language and terminology*

## Specification Reference
**CV01**: Extract user's exact words, phrases, and terminology without modification

## Challenging Test Scenarios

### Scenario 1: Industry-Specific Jargon
**Input CV Content**:
```
"Architected microservices using event-driven patterns"
"Orchestrated CI/CD pipelines with GitOps methodology"  
"Implemented blue-green deployments via Kubernetes"
```

**Expected Behavior**:
- Extract exact phrases: "Architected microservices", "event-driven patterns"
- Preserve technical terms exactly: "GitOps methodology", "blue-green deployments"
- Maintain user's verb choice: "Orchestrated" not "Managed" or "Led"

**Success Criteria**:
- 100% exact match between source and extracted technical terminology
- No paraphrasing or "improvement" of user's language choices
- Technical terms preserved with exact spelling and capitalization

### Scenario 2: Cultural and Linguistic Variations
**Input CV Content**:
```
"Specialised in optimisation techniques"  (British spelling)
"Managed a team of 5 whilst maintaining quality standards"
"Achieved £50K cost savings through process improvements"
```

**Expected Behavior**:
- Preserve British spellings: "Specialised", "optimisation"
- Keep cultural linguistic choices: "whilst" instead of "while"
- Maintain currency symbols and formats: "£50K"

**Success Criteria**:
- No conversion to American spellings
- Cultural linguistic choices preserved exactly
- Regional formatting conventions maintained

### Scenario 3: Personal Voice and Style
**Input CV Content**:
```
"Passionate about creating user-centric solutions"
"Thrives in fast-paced, collaborative environments"
"Believes in continuous learning and knowledge sharing"
```

**Expected Behavior**:
- Preserve personal language: "Passionate about", "Thrives in", "Believes in"
- Maintain first vs third person voice as chosen by user
- Keep emotional/personality descriptors exactly as written

**Success Criteria**:
- Personal voice indicators preserved exactly
- No standardization of personality descriptors
- User's chosen perspective (first/third person) maintained

### Scenario 4: Non-Standard Descriptions
**Input CV Content**:
```
"Ninja-level proficiency in JavaScript"
"Rockstar developer with 5+ years experience"
"Growth-hacked user acquisition by 300%"
```

**Expected Behavior**:
- Preserve unconventional terms: "Ninja-level", "Rockstar developer"
- Keep modern terminology: "Growth-hacked"
- Maintain user's creative language choices

**Success Criteria**:
- No conversion to "standard" professional language
- Creative terminology preserved exactly
- User's personality through language maintained

## Failure Modes

### Common Failures to Test For:
1. **Paraphrasing**: Changing "Architected" to "Designed" or "Built"
2. **Standardization**: Converting "whilst" to "while" or "specialised" to "specialized"
3. **Professionalization**: Changing "Ninja-level" to "Expert-level"
4. **Improvement**: Enhancing grammar or word choice from original

### Red Flag Behaviors:
- Any modification of user's original word choices
- "Cleaning up" or "improving" user's language
- Converting regional variations to different standards
- Standardizing personal voice or style

## Testing Protocol

### Automated Testing:
- Semantic similarity scoring between source and extracted text (target: 99%+)
- Exact string matching for technical terms and proper nouns
- Cultural variation detection and preservation validation

### Manual Review:
- Regular sampling of extracted content against source CVs
- Focus on creative, technical, and culturally-specific language
- User feedback analysis for language preservation complaints

### Success Metrics:
- 99%+ preservation of original terminology in extraction
- Zero user complaints about language modification
- Consistent preservation across all CV formats and languages

---

*This test case validates the fundamental principle that user's authentic voice is their competitive advantage and must be preserved exactly.*