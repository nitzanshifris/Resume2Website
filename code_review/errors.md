- 400 Resume Gate (not a resume)
  - Title: Not a resume
  - Message: This file doesn’t look like a resume (CV).
  - Suggestion: Use a resume with contact info and sections like Experience, Education, and Skills.

- 400 Invalid file (type/content mismatch or unreadable)
  - Title: Unsupported or corrupted file
  - Message: The file type doesn’t match its contents or can’t be read.
  - Suggestion: Upload a PDF, DOC/DOCX, TXT, PNG, JPG, or WEBP exported directly from your editor.

- 401/403 Authentication required
  - Title: Sign in to continue
  - Message: Creating a portfolio requires an account.
  - Suggestion: Sign in to link this upload to your workspace.

- 408 Upload timed out
  - Title: Upload timed out
  - Message: The connection took too long and the upload was interrupted.
  - Suggestion: Check your network and try again; large files work best on a stable connection.

- 413 File too large
  - Title: File is too large
  - Message: Maximum file size is {MAX_MB} MB.
  - Suggestion: Reduce the file size (export to PDF, compress images) and try again.

- 415 Unsupported media type
  - Title: File type not supported
  - Message: Supported types: PDF, DOC/DOCX, TXT, PNG, JPG, WEBP, RTF.
  - Suggestion: Export your resume to one of the supported formats and re‑upload.

- 429 Too many uploads (rate limit)
  - Title: Too many uploads
  - Message: You’ve reached the upload limit for now.
  - Suggestion: Please wait and try again later. Sign in for higher limits.

- 422 Couldn’t extract text (OCR/text)
  - Title: Couldn’t read the file
  - Message: We couldn’t extract text from this file.
  - Suggestion: Try a higher‑quality scan or export a text‑based PDF.

- 404 Not found (job/file)
  - Title: Item not found
  - Message: We couldn’t find that upload (it may have expired).
  - Suggestion: Upload the file again to continue.

- 500 Something went wrong
  - Title: Something went wrong
  - Message: We couldn’t process the file due to a server error.
  - Suggestion: Try again in a few minutes. If this keeps happening, export to PDF or contact support.

Note: Update the retry file picker accept list to match backend support: .pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp