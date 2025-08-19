# Hero Section Data Mapping

## Frontend Requirements (From Screenshot)

The hero section displays:
1. **Profile Photo Circle** - A circular placeholder for user photo (can be uploaded or provided via URL)
2. **Main Title: "Your Name"** - Should display the person's full name
3. **Subtitle: "Your Professional Title"** - Should display their professional role/title
4. **Static Button: "Contact Me"** - This is hardcoded, not from data

## Current Backend Structure

```json
{
  "hero": {
    "fullName": "ALEXANDER TAYLOR",
    "professionalTitle": "Senior Product Manager | SaaS | UX Optimization",
    "profilePhotoUrl": null
  }
}
```

## Frontend Expected Structure

```typescript
interface HeroData {
  fullName: string              // Maps to "Your Name" text
  professionalTitle: string      // Maps to "Your Professional Title" text
  profilePhotoUrl: string | null // Maps to profile image circle
}
```

## Mapping Analysis

✅ **CORRECT MAPPINGS:**
- `fullName` → Main title "Your Name"
- `professionalTitle` → Subtitle "Your Professional Title"
- `profilePhotoUrl` → Profile image circle
- The "Contact Me" button is static and doesn't need data

## Backend Requirements

The backend should ensure:

1. **fullName**: Always extract and provide the person's full name
2. **professionalTitle**: Extract their main professional title/role
3. **profilePhotoUrl**: 
   - Can be null (shows placeholder)
   - Can be a URL to an image
   - Can be a base64 encoded image (from upload)

## Example Correct Output

```json
{
  "hero": {
    "fullName": "Alex Johnson",
    "professionalTitle": "Senior Full Stack Developer",
    "profilePhotoUrl": null  // or URL or base64
  }
}
```

## Visual Mapping

```
Backend Data          →    Frontend Display
────────────────────────────────────────────
fullName             →    "Your Name" (main title)
professionalTitle    →    "Your Professional Title" (subtitle)
profilePhotoUrl      →    Circle image placeholder
(nothing)            →    "Contact Me" button (static)
```

## Notes for Enhancement Processor

The `enhancement_processor.py` should:
1. Clean up the fullName (remove all caps if present)
2. Simplify professionalTitle if it's too long (e.g., "Senior Product Manager | SaaS | UX" → "Senior Product Manager")
3. Leave profilePhotoUrl as null unless a photo URL is found in the CV