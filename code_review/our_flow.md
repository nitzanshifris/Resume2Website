The Anonymous → Authenticated Flow (No Re-upload!)

  1. Anonymous User Uploads File

  // In handleFileSelect (page.tsx)
  if (isAuthenticated) {
    await startAuthenticatedFlow(file)
  } else {
    await startPreviewFlow(file)  // <-- Anonymous user goes here
  }

  2. What startPreviewFlow Does

  // In useJobFlow.tsx
  const startPreviewFlow = async (file: File) => {
    // Upload to /api/v1/upload-anonymous (validation only, NO extraction)
    const { job_id } = await api.uploadAnonymous(file)

    dispatch({ type: FlowAction.UploadSucceeded, jobId: job_id })
    // State: Previewing, currentJobId: job_id

    // Wait 6 seconds for animation
    await new Promise(resolve => setTimeout(resolve, 6000))

    dispatch({ type: FlowAction.WaitForAuth })
    // State: WaitingAuth, currentJobId: STILL SET
  }

  Key Point: The currentJobId is saved and state is WaitingAuth

  3. User Signs Up - handleAuthSuccess Called

  // In page.tsx
  const handleAuthSuccess = async (data: any) => {
    await signIn(data.session_id, data)

    // Continue JobFlow if there's a pending job
    if (jobFlowContext.currentJobId && jobFlowContext.state === FlowState.WaitingAuth) {
      console.log('🚀 Continuing portfolio generation after auth...')
      startPostSignupFlow(jobFlowContext.currentJobId)  // <-- Uses EXISTING job_id!
    }
  }

  4. What startPostSignupFlow Does

  // In useJobFlow.tsx
  const startPostSignupFlow = async (jobId: string) => {
    // CRITICAL: Uses the EXISTING job_id from anonymous upload

    // Step 1: Claim ownership (transfers anonymous job to user)
    await performClaim(jobId)  // <-- Same job_id, NO re-upload

    // Step 2: Extract CV data (first time for this job)
    await performExtract(jobId)  // <-- Same job_id

    // Step 3: Generate portfolio
    await performGenerate(jobId)  // <-- Same job_id
  }

  🎯 Why No Re-upload Happens:

  1. Anonymous upload creates job_id → Saved in currentJobId
  2. State becomes WaitingAuth → Job is paused, not lost
  3. After signup → startPostSignupFlow(currentJobId) uses THE SAME job_id
  4. Claim endpoint → Transfers ownership from anonymous to authenticated user
  5. Extract/Generate → Work on the already uploaded file

  📦 The Data Flow:

  Anonymous Upload (/upload-anonymous)
      ↓
  job_id: "abc123" created
  File saved on backend
      ↓
  Frontend state: { currentJobId: "abc123", state: "WaitingAuth" }
      ↓
  User signs up
      ↓
  Claim (/api/v1/claim) with job_id: "abc123"
      ↓
  Backend transfers ownership of EXISTING file
      ↓
  Extract (/api/v1/extract/abc123) - uses already uploaded file
      ↓
  Generate (/api/v1/portfolio/generate/abc123)

  🔒 Persistence Across Signup:

  Even if the page refreshes during signup:

  // In useJobFlow.tsx - resumeFromStorage()
  const stored = loadFlowState()
  if (stored.state === FlowState.WaitingAuth && isAuthenticated) {
    // Auto-continue with stored.currentJobId
    startPostSignupFlow(stored.currentJobId)
  }

  ✅ The Key Design Points:

  1. /upload-anonymous - Saves file but doesn't extract (lightweight)
  2. currentJobId - Preserved throughout the entire flow
  3. /claim - Transfers ownership without re-uploading
  4. localStorage - Survives page refreshes during OAuth redirects
  5. Idempotency - Claim returns success even if already owned

  The file is uploaded ONCE and the same job_id flows through the entire process! The backend keeps the file associated with that job_id, and the claim endpoint just changes ownership from anonymous to the authenticated user.
