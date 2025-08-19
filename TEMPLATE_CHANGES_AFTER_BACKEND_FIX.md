# Template Changes Required After Backend Fixes

## 1. Remove `hero.summaryTagline` 
- Backend no longer sends this field (was duplicate of `summary.summaryText`)
- Remove from all template files where it appears

## 2. Technologies in Experience Items
- Backend now properly filters and validates `technologiesUsed` field
- Removes generic terms like "teams", "office", "software", etc.
- Frontend should display these as badges below job descriptions
- Check that experience cards properly show the technologiesUsed array