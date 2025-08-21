 🔵 TEST SUITE 1: Anonymous User Flows


i did - 


### 1.1 Main Upload Button (Hero Section)
**Steps:**
1. Fresh page load (not logged in)
2. Click "Upload your CV now" button in hero section (blue gradient button with upload icon)
3. Select valid CV file (accepts: .pdf, .doc, .docx, .txt, .rtf, .png, .jpg, .jpeg, .webp, .heic, .heif, .tiff, .bmp)

what happend - the cv file did entered the card in the cv file , but nothing started automaticly . backend didnt show anything . from some reason , when i click the card presenting the cv - the animation has started . it shouldnt be clickable but start automaticly after the validation . after i signedup in the end of animation i got this - '/Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-08-21 at 14.52.55.png'.
    the backend terminal logs are :➜  ➜  cv2web-v4 git:(development-flow-rebuild) ✗ python3 -m uvicorn main:app --host 127.0.0.1 --port 2000
INFO:     Started server process [22728]
INFO:     Waiting for application startup.
2025-08-21 14:51:08,757 - main - INFO - Initializing database...
2025-08-21 14:51:08,757 - src.api.db - INFO - file_hash column already exists
2025-08-21 14:51:08,757 - src.api.db - INFO - Created file_hash index
2025-08-21 14:51:08,757 - src.api.db - INFO - Database initialized successfully
2025-08-21 14:51:08,757 - main - INFO - Database initialized successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:2000 (Press CTRL+C to quit)
INFO:     127.0.0.1:58202 - "GET /api/v1/auth/google/status HTTP/1.1" 200 OK
INFO:     127.0.0.1:58202 - "GET /api/v1/auth/google/status HTTP/1.1" 200 OK
INFO:     127.0.0.1:58202 - "GET /api/v1/auth/google/status HTTP/1.1" 200 OK
INFO:     127.0.0.1:58202 - "GET /api/v1/auth/google/status HTTP/1.1" 200 OK
INFO:     127.0.0.1:58210 - "OPTIONS /api/v1/register HTTP/1.1" 200 OK
2025-08-21 14:52:00,521 - passlib.handlers.bcrypt - WARNING - (trapped) error reading bcrypt version
Traceback (most recent call last):
  File "/Users/nitzan_shifris/Library/Python/3.9/lib/python/site-packages/passlib/handlers/bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
AttributeError: module 'bcrypt' has no attribute '__about__'
2025-08-21 14:52:00,721 - src.api.routes.user_auth - INFO - New user registered: sc@gmail.com
INFO:     127.0.0.1:58210 - "POST /api/v1/register HTTP/1.1" 200 OK
INFO:     127.0.0.1:58212 - "GET /api/v1/portfolio/list HTTP/1.1" 200 OK






my coder say - Here’s the updated, code-verified review after your latest changes.

### Verified good
- Orchestrators are the only entry points in `page.tsx`; no direct `uploadFile(` in the page.
- Anonymous→auth resumes via `startPostSignupFlow(jobId)`; no parallel claim/extract/generate chains.
- Rendering reads `jobFlowContext.portfolioUrl` (hydration works; MacBook replacement at 80% is correct).
- Progress uses the unified components and 60→80 mapping.
- Portfolio Completion Popup integrated; 3-button post-completion UI and wider MacBook applied.
- Dashboard accepts `portfolioUrl` and can land on “website” page.

### Still broken (matches your manual test)
- Auto-start preview doesn’t trigger after anonymous upload
  - Root cause: the preview effect exits early when a JobFlow `currentJobId` exists, so visuals never start.
```1809:1819:user_web_example/app/page.tsx
// Skips as soon as a job exists (even though we want to animate)
if (jobFlowContext.currentJobId) {
  console.log('⏭️ Skipping auto-start, already have job_id:', jobFlowContext.currentJobId)
  return
}
```
  - Fix: drive preview animation from JobFlow state, not jobId. If unauthenticated and state is Previewing or WaitingAuth, start `startPreviewAnimation(undefined, true)` once (use a ref to avoid repeats).

- ReferenceError: setShowAuthModal is not defined (exactly as you hit)
  - Root cause: inner `handleAuthSuccess` (inside the demo) calls the parent’s state setter.
```1743:1755:user_web_example/app/page.tsx
setShowSignupModal(false)
setShowAuthModal(false) // not defined in this scope → ReferenceError
```
  - Fix: remove this call or pass a `closeAuthModal` prop from the parent; the parent already closes the auth modal in its own handler.

### Cleanups to finish the migration
- Duplicate `handleAuthSuccess` functions remain (two scopes). They’re both JobFlow-safe now, but:
  - Either keep both, ensuring the child never references parent-only state setters, or
  - Deduplicate: keep one in the parent and pass it down to both `AuthModal` usages.

- Legacy direct uploads still exist off the main path
  - `user_web_example/components/processing-page.tsx`: direct `uploadFile(`.
  - `user_web_example/components/upload-resume.tsx`: direct `uploadFile(`.
  - Either switch these to orchestrators or keep them out of the active path.

### Minimal changes to pass TEST_MISSION 1.1
- In the preview effect, replace the jobId early-return with a state-driven trigger:
  - If unauthenticated and `FlowState.Previewing` or `FlowState.WaitingAuth`, call `startPreviewAnimation(undefined, true)` once.
- Remove (or prop-wire) the child `setShowAuthModal(false)` call causing the ReferenceError.

If you want, I can apply those two edits now and convert the two remaining `uploadFile` usages to orchestrators.