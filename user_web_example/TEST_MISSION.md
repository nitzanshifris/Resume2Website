# 🧪 JobFlow Integration Test Mission

## Pre-Test Setup
- [ ] Clear all browser data (localStorage, cookies, cache)
- [ ] Open browser DevTools → Network tab (to monitor API calls)
- [ ] Open browser DevTools → Console (to watch for errors/duplicates)
- [ ] Have 3 test files ready:
  - ✅ Valid CV (PDF with contact info, experience, education)
  - ❌ Invalid file (random image without CV content)
  - ⚠️ Edge case file (CV screenshot as PNG/JPG with readable text)
- [ ] Note: The app accepts these file types: .pdf, .doc, .docx, .txt, .rtf, .png, .jpg, .jpeg, .webp, .heic, .heif, .tiff, .bmp

---

## 🔵 TEST SUITE 1: Anonymous User Flows

### 1.1 Main Upload Button (Hero Section)
**Steps:**
1. Fresh page load (not logged in)
2. Click "Upload your CV now" button in hero section (blue gradient button with upload icon)
3. Select valid CV file (accepts: .pdf, .doc, .docx, .txt, .rtf, .png, .jpg, .jpeg, .webp, .heic, .heif, .tiff, .bmp)
4. **Verify:**
   - [ ] File uploads to `/api/v1/upload-anonymous` (NOT `/upload`)
   - [ ] CV card appears showing the uploaded file
   - [ ] MacBook animation starts
   - [ ] Progress bar appears on the left side and starts moving
   - [ ] After 6 seconds MacBook opens, then 3 more seconds (9 total), signup modal appears
   - [ ] Check localStorage has `jobflow_state` with `currentJobId`
   - [ ] No duplicate API calls in Network tab

### 1.2 InteractiveCVPile Component (CV Cards)
**Steps:**
1. Fresh page load (not logged in)
2. Look for the CV cards in hero section (may show Louis Wood, Sophia Brown examples)
3. Click on any CV card to open file selector
4. Select valid CV file
5. **Verify:**
   - [ ] File selector opens with correct accept types
   - [ ] After selecting, your CV appears as a card in the pile
   - [ ] Same flow as 1.1 (animation, progress, signup modal)
   - [ ] Only ONE `/upload-anonymous` call
   - [ ] Can also drag & drop file onto the CV pile area

### 1.3 Navbar Upload Button
**Steps:**
1. Fresh page load (not logged in)
2. Look at the navbar (top of page)
3. Click "Upload your CV now" button in navbar (blue gradient button)
4. Select valid CV file
5. **Verify:**
   - [ ] File selector opens with correct accept types
   - [ ] Same flow as 1.1
   - [ ] JobFlow prevents duplicate if already processing
   - [ ] Button is visible on both desktop and mobile views

### 1.4 Start Now Button (After Typewriter)
**Steps:**
1. Fresh page load (not logged in)
2. Wait for typewriter animation to complete (or it may already be visible)
3. Click "Start now" button (appears below the typewriter text)
4. **Verify:**
   - [ ] If no file uploaded: Auth modal opens
   - [ ] If file already uploaded and processing: May show signup modal or pricing modal
   - [ ] No console errors
   - [ ] Button has pulsing animation when progress >= 60%

### 1.5 Mobile Menu Upload
**Steps:**
1. Open site on mobile view (or DevTools mobile mode)
2. Click hamburger menu icon (☰) in navbar
3. Mobile menu slides down
4. Click "Upload your CV now" button in mobile menu
5. **Verify:**
   - [ ] File selector opens on mobile
   - [ ] Same upload flow works on mobile
   - [ ] Progress bar displays correctly on mobile
   - [ ] Signup modal is responsive

---

## 🟢 TEST SUITE 2: Anonymous → Authenticated Transition

### 2.1 Complete Signup After Upload
**Steps:**
1. Upload CV as anonymous (any method from Suite 1)
2. Wait for signup modal
3. Complete signup with email/password
4. **Verify:**
   - [ ] After signup, see `/api/v1/claim` call with SAME job_id
   - [ ] Then `/api/v1/extract/{job_id}` call
   - [ ] Then `/api/v1/portfolio/generate/{job_id}` call
   - [ ] Portfolio displays at 80% (visual)
   - [ ] NO second upload call
   - [ ] Check console for "Continuing portfolio generation after auth..."

### 2.2 Google OAuth Signup (If Configured)
**Steps:**
1. Upload CV as anonymous
2. In signup modal, check if "Continue with Google" button exists
3. If available, click it and complete Google auth
4. **Verify:**
   - [ ] OAuth popup or redirect opens
   - [ ] After auth, page returns to app
   - [ ] JobFlow resumes automatically (check for claim/extract/generate)
   - [ ] localStorage `jobflow_state` updates to show completion
   - [ ] Portfolio shows without re-upload
   - [ ] Note: May not be available if OAuth not configured on backend

### 2.3 LinkedIn OAuth Signup (If Available)
**Steps:**
1. Upload CV as anonymous
2. Check if "Continue with LinkedIn" option exists
3. If available, complete LinkedIn auth
4. **Verify:**
   - [ ] Similar to Google OAuth flow if configured
   - [ ] JobFlow resumes from stored state
   - [ ] Note: Feature may not be implemented yet

### 2.4 Close Modal and Re-open
**Steps:**
1. Upload CV as anonymous
2. When signup modal appears, close it (X button)
3. Click "Start now" button again
4. **Verify:**
   - [ ] Signup modal re-opens
   - [ ] Same job_id is maintained (check localStorage)
   - [ ] Completing signup continues original job
   - [ ] No duplicate upload

---

## 🔴 TEST SUITE 3: Error Handling & Recovery

### 3.1 Invalid File (Resume Gate)
**Steps:**
1. Click any upload button
2. Select a non-CV file (like a random image without text)
3. **Verify:**
   - [ ] Error toast appears with rejection reason
   - [ ] Suggestion text provides guidance
   - [ ] CV card may hide or stay visible
   - [ ] MacBook animation doesn't start or stops
   - [ ] Progress stays at 0
   - [ ] Can immediately upload a new file

### 3.2 Error Toast Retry Button
**Steps:**
1. Trigger an error (upload invalid file)
2. Error toast appears
3. Look for "Try again" or retry button in toast
4. Click retry and select a VALID CV
5. **Verify:**
   - [ ] File selector opens again
   - [ ] New upload starts fresh
   - [ ] No lingering state from previous error
   - [ ] Flow continues normally
   - [ ] Only ONE new upload call

### 3.3 Network Error Simulation
**Steps:**
1. Open DevTools → Network → Throttle to "Offline"
2. Try to upload a file
3. **Verify:**
   - [ ] Error toast shows "Connection problem"
   - [ ] Turn network back on
   - [ ] Click retry → upload works
   - [ ] JobFlow handles recovery gracefully

### 3.4 Page Refresh During Processing
**Steps:**
1. Upload CV as anonymous
2. During MacBook animation, refresh the page
3. **Verify:**
   - [ ] Page reloads
   - [ ] Check localStorage still has `jobflow_state`
   - [ ] Progress might reset visually but job_id preserved
   - [ ] After signup, continues with SAME job_id

### 3.5 API Timeout Handling
**Steps:**
1. Upload a very large CV file (>5MB if possible)
2. Watch for timeout handling
3. **Verify:**
   - [ ] If timeout occurs, error toast appears
   - [ ] Message mentions timeout
   - [ ] Retry button available
   - [ ] Retry uses exponential backoff (check Network timing)

---

## 🟡 TEST SUITE 4: Authenticated User Flows

### 4.1 Direct Upload (Already Logged In)
**Steps:**
1. Log in first (before uploading)
2. Click "Upload your CV now" button (any location - hero, navbar, etc.)
3. Select valid CV
4. **Verify:**
   - [ ] For authenticated users: Navbar "Upload your CV now" button opens Dashboard
   - [ ] Hero button should use `/api/v1/upload` (NOT `/upload-anonymous`)
   - [ ] No signup modal appears (already authenticated)
   - [ ] Direct extraction and generation
   - [ ] Progress goes smoothly to 80%
   - [ ] Portfolio generates without auth interruption

### 4.2 Multiple Uploads Prevention
**Steps:**
1. As authenticated user, upload a CV
2. While processing, try to upload another file
3. **Verify:**
   - [ ] Second upload is blocked
   - [ ] Console shows "🛑 BLOCKED" message or similar JobFlow blocking message
   - [ ] No duplicate API calls
   - [ ] First upload continues uninterrupted

### 4.3 Complete Then Upload Again
**Steps:**
1. Upload CV and wait for completion (80%)
2. Click upload button again
3. Select a different CV
4. **Verify:**
   - [ ] CLEAR_LOCK allows new upload
   - [ ] New job_id is generated
   - [ ] Previous portfolio URL is cleared
   - [ ] New upload proceeds normally

---

## 🟣 TEST SUITE 5: Progress & UI State

### 5.1 Progress Bar Behavior
**Steps:**
1. Upload any valid CV
2. Watch progress bar carefully
3. **Verify:**
   - [ ] Starts at 0%
   - [ ] Smooth animation (no jumps)
   - [ ] Reaches exactly 80% when complete (visual)
   - [ ] Shows ready state at 80%
   - [ ] Progress circle may pulse or have visual indicator at 80%

### 5.2 Portfolio Auto-Display at 80%
**Steps:**
1. Upload CV and wait for 80%
2. Observe what happens automatically
3. **Verify:**
   - [ ] Portfolio should display automatically (or not, based on design)
   - [ ] URL updates with portfolio_url parameter
   - [ ] MacBook frame shows portfolio when ready

### 5.3 MacBook Portfolio Display
**Steps:**
1. Complete any upload flow
2. When progress reaches 80%
3. **Verify:**
   - [ ] MacBook frame appears on the right side
   - [ ] Portfolio loads inside MacBook iframe
   - [ ] Portfolio URL is correct (localhost:4000-5000 range)
   - [ ] Can interact with portfolio inside iframe
   - [ ] URL in address bar updates with portfolio_url parameter
   - [ ] No CORS errors in console

---

## 🔷 TEST SUITE 6: Edge Cases & Persistence

### 6.1 Logout During Processing
**Steps:**
1. As authenticated user, start upload
2. During processing, click logout
3. **Verify:**
   - [ ] Logout completes
   - [ ] Processing continues (job already started)
   - [ ] Portfolio might not display (needs auth)
   - [ ] Can log back in to see result

### 6.2 Browser Back/Forward
**Steps:**
1. Upload CV and get portfolio
2. Click browser back button
3. Click browser forward button
4. **Verify:**
   - [ ] State is maintained
   - [ ] Portfolio URL in query params preserved
   - [ ] No duplicate uploads triggered

### 6.3 Multiple Tabs
**Steps:**
1. Open site in Tab 1, upload CV
2. Open site in Tab 2 while Tab 1 processing
3. **Verify:**
   - [ ] Tab 2 shows fresh state (localStorage not shared in real-time)
   - [ ] Can start separate upload in Tab 2
   - [ ] No interference between tabs

### 6.4 Mobile Responsiveness
**Steps:**
1. Open DevTools → Device mode (mobile)
2. Test all upload methods on mobile view
3. **Verify:**
   - [ ] All upload buttons accessible
   - [ ] Progress bar displays correctly
   - [ ] Modals are responsive
   - [ ] Touch interactions work

---

## 🟢 TEST SUITE 7: Post-Generation Flow (Authenticated Users)

### 7.1 Portfolio Completion Popup
**Steps:**
1. As authenticated user, upload CV
2. Wait for portfolio to reach 80% (visual progress)
3. **Verify:**
   - [ ] Portfolio Completion Popup appears after 1 second delay
   - [ ] Shows one of two text variants (randomly selected):
     - "Almost there! Just a few fun touches left" OR
     - "Your portfolio is 80% complete!"
   - [ ] Animated 80% circle with sparkles
   - [ ] Large modal covering most of screen (hard to dismiss)
   - [ ] Button text matches the selected variant

### 7.2 Edit Portfolio Path (Click Button in Popup)
**Steps:**
1. When popup appears, click the main button
2. **Verify:**
   - [ ] Popup closes
   - [ ] Dashboard opens to "website" page
   - [ ] Portfolio displayed in fullscreen with edit features
   - [ ] Can edit and save changes
3. Exit dashboard (click back to home)
4. **Verify:**
   - [ ] Returns to home screen
   - [ ] MacBook is wider (75% of screen)
   - [ ] Progress bar is hidden
   - [ ] Three buttons appear:
     - "Go Live" (purple gradient, pulsing)
     - "Edit Portfolio" (white with gray border)
     - "Learn more" (black)

### 7.3 Dismiss Path (Click Outside Popup)
**Steps:**
1. When popup appears, click outside the modal (difficult due to size)
2. **Verify:**
   - [ ] Popup closes
   - [ ] Returns to home screen
   - [ ] MacBook is wider (75% of screen)
   - [ ] Progress bar is hidden
   - [ ] Same three buttons appear:
     - "Go Live" (purple gradient, pulsing)
     - "Edit Portfolio" (white with gray border)
     - "Learn more" (black)

### 7.4 Post-Generation Button Actions
**Steps:**
1. After generation completes (either path)
2. Test "Go Live" button
   - [ ] Opens Stripe embedded checkout modal
   - [ ] Shows subscription pricing
3. Test "Edit Portfolio" button
   - [ ] Opens dashboard to "website" page
   - [ ] Can edit portfolio
   - [ ] On return, maintains same state (3 buttons, wide MacBook)
4. Test "Learn more" button
   - [ ] Scrolls smoothly to demo section
   - [ ] No state changes

### 7.5 State Persistence
**Steps:**
1. Complete generation and dismiss popup
2. Refresh the page
3. **Verify:**
   - [ ] Portfolio URL persists in localStorage
   - [ ] MacBook shows portfolio if available
   - [ ] Three buttons remain visible if generation was completed
   - [ ] Can still access all functions

---

## 🟠 TEST SUITE 8: Payment & Premium Features

### 8.1 Pricing Modal
**Steps:**
1. Upload CV as anonymous
2. Complete signup
3. When progress reaches 60% (semantic) / 80% (visual)
4. Click "Start now" button if visible
5. **Verify:**
   - [ ] Pricing modal may open (depends on flow)
   - [ ] If opens, shows pricing tiers
   - [ ] Can close modal without paying
   - [ ] Portfolio preview accessible at localhost:4000-5000

### 8.2 Dashboard Access
**Steps:**
1. As authenticated user
2. Look at navbar - should see "Welcome, [username]"
3. Click "Dashboard" button in navbar
4. **Verify:**
   - [ ] SimpleDashboard component loads
   - [ ] Shows previous portfolios if any
   - [ ] Can upload new CV from dashboard
   - [ ] Logout button is visible
   - [ ] For authenticated users, navbar "Upload your CV now" button opens Dashboard

---

## 📊 Performance & Console Checks

### Throughout ALL Tests, Monitor:
- [ ] **No duplicate API calls** - Each endpoint called once per action
- [ ] **No console errors** - Except intentional error handling
- [ ] **No memory leaks** - Check DevTools Performance tab
- [ ] **localStorage cleanup** - Old states are cleared properly
- [ ] **Network efficiency** - Uploads under 10 seconds for 1MB file

### Console Logs to Verify:
```
✅ Good logs:
- "📁 File selected, using JobFlow orchestrator"
- "🚀 Continuing portfolio generation after auth"
- "🔓 Clearing previous job lock to allow new upload"

❌ Bad logs (should NOT see):
- "🛑 BLOCKED: handleStartDemo called but currentJobId exists" (except when intended)
- Multiple "Uploading file..." for same action
- "Already validating a file" repeatedly
```

---

## 🏁 Final Checklist

After completing all test suites:

- [ ] All anonymous flows lead to signup modal
- [ ] All authenticated flows skip signup
- [ ] No duplicate uploads in any scenario
- [ ] Progress always reaches exactly 80% visual
- [ ] Error recovery works for all error types
- [ ] localStorage persists correctly
- [ ] Page refresh doesn't break flows
- [ ] OAuth flows resume correctly
- [ ] CLEAR_LOCK allows new uploads after completion
- [ ] All upload entry points use JobFlow orchestrators

---

## 🐛 Bug Report Template

If you find issues, document:

**Bug Title:** [Component] - [Brief Description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** What should happen

**Actual:** What actually happened

**Console Errors:** Copy any errors

**Network Calls:** List unexpected API calls

**JobFlow State:** Check localStorage `jobflow_state`

---

## 📈 Success Metrics

The JobFlow integration is successful if:
- ✅ 0 duplicate uploads across all test scenarios
- ✅ 100% of flows reach completion or show appropriate errors
- ✅ Recovery works for all interruption scenarios
- ✅ Anonymous → Authenticated transition preserves job_id
- ✅ Progress display is consistent across all components
- ✅ No regression in existing features

---

**Test Duration:** ~2-3 hours for complete suite
**Recommended:** Test in Chrome, Firefox, and Safari
**Critical:** Test both desktop and mobile viewports