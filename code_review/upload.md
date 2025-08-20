Ran tool
Ran tool

Ran tool

- Dropbox/Choose Files in Upload modal (components/upload-resume.tsx)
  - UX: In-modal flow with “Validating file…” state, then “Processing your files…” progress. Supports multiple files (images) only if authenticated; shows per-file status list.
  - Validation: Client pre-check (type/size), then calls uploadFile (or uploadMultipleFiles). Only shows progress after backend 200 OK. On 401/403 triggers onAuthRequired.
  - Errors: Mostly alert() messages; no ErrorToast. Clear blocking (stops validating/uploading immediately).

- “Upload” buttons in Home page (app/page.tsx) and Navbar button
  - How it triggers: Sets uploadedFile in parent → useEffect watches uploadedFile from any source (dropzone, buttons, navbar).
  - Authenticated flow: handleStartDemo() now uploads first (uploadFile), and only if 200 OK starts MacBook animation and full processing (processPortfolioGeneration).
  - Anonymous flow: startPreviewAnimation() now uploads first (uploadFile), and only if 200 OK starts preview animation; later prompts signup. No multi-file support here.
  - Errors: Uses ErrorToast with friendly copy (e.g., “Not a resume”) and stops animation; shows signup modal on 401/403.

- Key differences
  - Multi-file: Only the Upload modal supports multi-image upload (and only when authenticated). Home/Navbar flows are single-file.
  - Progress UI: Upload modal shows in-modal progress list per file; Home/Navbar shows MacBook animation/progress (only after validation).
  - Error UI: Upload modal uses alert(); Home/Navbar uses ErrorToast + auth modal on 401/403.
  - Control handoff: Upload modal calls onSuccess(jobId) and may redirect; Home/Navbar proceeds with on-page animation and then generation.

- Consistency status
  - Validation-first behavior is aligned across all three: uploadFile is awaited before any animation/progress.
  - Remaining divergence is intentional (multi-file support, UI styling, error presentation).