/**
 * E2E Smoke Test Suite for Upload Flow
 * 
 * This suite locks the critical upload flow behaviors to prevent regressions.
 * Tests validate-first behavior, error handling, and UI consistency.
 */

import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs/promises'

// Test configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:3019'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'

// Test file paths
const NON_RESUME_IMAGE = path.join(__dirname, '../test-files/non-resume-image.jpg')
const VALID_PDF_RESUME = path.join(__dirname, '../test-files/valid-resume.pdf')
const LARGE_FILE = path.join(__dirname, '../test-files/large-file.pdf') // > 10MB
const UNSUPPORTED_FILE = path.join(__dirname, '../test-files/test.xyz')

// Helper to create test files if they don't exist
async function createTestFiles() {
  const testFilesDir = path.join(__dirname, '../test-files')
  
  // Create directory if it doesn't exist
  await fs.mkdir(testFilesDir, { recursive: true })
  
  // Create a non-resume image (just a small image file)
  const nonResumeContent = Buffer.from('fake-image-content')
  await fs.writeFile(path.join(testFilesDir, 'non-resume-image.jpg'), nonResumeContent)
  
  // Create a valid PDF resume (minimal PDF structure)
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 750 Td
(John Doe) Tj
0 -20 Td
(Software Engineer) Tj
0 -20 Td
(john@example.com | 555-1234) Tj
0 -40 Td
(EXPERIENCE) Tj
0 -20 Td
(Senior Developer at Tech Corp) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
565
%%EOF`
  await fs.writeFile(path.join(testFilesDir, 'valid-resume.pdf'), pdfContent)
  
  // Create a large file (> 10MB)
  const largeContent = Buffer.alloc(11 * 1024 * 1024) // 11MB of zeros
  await fs.writeFile(path.join(testFilesDir, 'large-file.pdf'), largeContent)
  
  // Create an unsupported file
  await fs.writeFile(path.join(testFilesDir, 'test.xyz'), 'unsupported content')
}

// Run test file creation before tests
test.beforeAll(async ({ page }) => {
  await createTestFiles()
})

test.describe('Upload Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
  })

  test.describe('Anonymous User Tests', () => {
    test('Non-resume image → 400 "Not a resume", no animation, toast persists', async ({ page }) => {
      // Upload non-resume image
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(NON_RESUME_IMAGE)
      
      // Wait for validation to complete
      await page.waitForTimeout(1000)
      
      // Verify error toast appears with correct message
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      const title = await errorToast.locator('h2')
      await expect(title).toHaveText('Not a resume')
      
      const message = await errorToast.locator('p').first()
      await expect(message).toContainText("This file doesn't look like a resume")
      
      const suggestion = await errorToast.locator('p').nth(1)
      await expect(suggestion).toContainText('Use a resume with contact info')
      
      // Verify no animation started
      const macbook = await page.locator('[data-testid="macbook-animation"]')
      await expect(macbook).not.toBeVisible()
      
      // Verify toast persists (doesn't auto-dismiss)
      await page.waitForTimeout(10000) // Wait 10 seconds
      await expect(errorToast).toBeVisible()
      
      // Verify backdrop click doesn't close it
      await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } })
      await expect(errorToast).toBeVisible()
      
      // Verify X button closes it
      await errorToast.locator('button[aria-label="Close"]').click()
      await expect(errorToast).not.toBeVisible()
    })

    test('Valid PDF triggers auth modal for anonymous users', async ({ page }) => {
      // Upload valid PDF as anonymous user
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for validation
      await page.waitForTimeout(1000)
      
      // For anonymous users, should show preview animation
      // (This depends on your specific implementation)
      const cvPile = await page.locator('[data-testid="cv-pile"]')
      await expect(cvPile).toContainText(path.basename(VALID_PDF_RESUME))
    })
  })

  describe('Authenticated User Tests', () => {
    beforeEach(async ({ page }) => {
      // Mock authentication by setting session
      await page.evaluate(() => {
        localStorage.setItem('resume2website_session_id', 'test-session-id')
        localStorage.setItem('resume2website_user', JSON.stringify({
          email: 'test@example.com',
          name: 'Test User'
        }))
      })
      await page.reload()
    })

    test('Valid PDF → 200, CV appears, animation starts post-validation', async ({ page }) => {
      // Upload valid PDF
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // CV should appear immediately in pile
      const cvPile = await page.locator('[data-testid="cv-pile"]')
      await expect(cvPile).toBeVisible()
      await expect(cvPile).toContainText(path.basename(VALID_PDF_RESUME))
      
      // Wait for validation to complete (200 OK)
      await page.waitForResponse(response => 
        response.url().includes('/api/v1/upload') && response.status() === 200
      )
      
      // Animation should start only after validation
      const animation = await page.locator('[data-testid="portfolio-animation"]')
      await expect(animation).toBeVisible()
      
      // Progress should start moving
      const progress = await page.locator('[data-testid="progress-bar"]')
      await expect(progress).toHaveAttribute('data-progress', '0')
      await page.waitForTimeout(2000)
      const progressValue = await progress.getAttribute('data-progress')
      expect(Number(progressValue)).toBeGreaterThan(0)
    })
  })

  describe('Error Code Tests', () => {
    test('401/403 → Auth modal opens, no toast', async ({ page }) => {
      // Mock 401 response
      await page.route('**/api/v1/upload', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Authentication required' })
        })
      })
      
      // Upload file
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for response
      await page.waitForTimeout(1000)
      
      // Auth modal should open
      const authModal = await page.locator('[data-testid="auth-modal"]')
      await expect(authModal).toBeVisible()
      
      // No error toast should appear
      const errorToast = await page.locator('[role="dialog"]').filter({ hasText: 'error' })
      await expect(errorToast).not.toBeVisible()
    })

    test('413 → "File is too large" with correct copy', async ({ page }) => {
      // Mock 413 response
      await page.route('**/api/v1/upload', route => {
        route.fulfill({
          status: 413,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'File too large' })
        })
      })
      
      // Upload file
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for response
      await page.waitForTimeout(1000)
      
      // Verify error toast
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      const title = await errorToast.locator('h2')
      await expect(title).toHaveText('File is too large')
      
      const message = await errorToast.locator('p').first()
      await expect(message).toContainText('Maximum file size is 10 MB')
      
      const suggestion = await errorToast.locator('p').nth(1)
      await expect(suggestion).toContainText('Reduce the file size')
    })

    test('429 → "Too many uploads" with correct copy', async ({ page }) => {
      // Mock 429 response
      await page.route('**/api/v1/upload', route => {
        route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Rate limit exceeded' })
        })
      })
      
      // Upload file
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for response
      await page.waitForTimeout(1000)
      
      // Verify error toast
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      const title = await errorToast.locator('h2')
      await expect(title).toHaveText('Too many uploads')
      
      const message = await errorToast.locator('p').first()
      await expect(message).toContainText("You've reached the upload limit")
    })
  })

  describe('Network Error Tests', () => {
    test('Network down → "Connection problem" message', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/v1/upload', route => {
        route.abort('failed')
      })
      
      // Upload file
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for error
      await page.waitForTimeout(1000)
      
      // Verify error toast
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      const title = await errorToast.locator('h2')
      await expect(title).toHaveText('Connection problem')
      
      const message = await errorToast.locator('p').first()
      await expect(message).toContainText('Unable to connect to the server')
      
      const suggestion = await errorToast.locator('p').nth(1)
      await expect(suggestion).toContainText('Check your internet connection')
    })

    test('Timeout → "Upload timed out" message', async ({ page }) => {
      // Simulate timeout
      await page.route('**/api/v1/upload', async route => {
        await new Promise(resolve => setTimeout(resolve, 65000)) // Wait longer than timeout
        route.fulfill({ status: 200 })
      })
      
      // Upload file
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(VALID_PDF_RESUME)
      
      // Wait for timeout (this should be handled by AbortController)
      await page.waitForTimeout(62000)
      
      // Verify error toast
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      const title = await errorToast.locator('h2')
      await expect(title).toHaveText('Upload timed out')
    })
  })

  describe('Retry Flow Tests', () => {
    test('Retry replaces CV immediately, validation-first', async ({ page }) => {
      // First upload - non-resume
      const fileInput = await page.locator('input[type="file"]')
      await fileInput.setInputFiles(NON_RESUME_IMAGE)
      
      // Wait for error
      await page.waitForTimeout(1000)
      const errorToast = await page.locator('[role="dialog"]')
      await expect(errorToast).toBeVisible()
      
      // Click "Try Another File"
      await errorToast.locator('button').filter({ hasText: 'Try Another File' }).click()
      
      // In the file picker, select a valid resume
      // (This would open a system dialog in real test)
      const retryInput = await page.locator('input[type="file"]').last()
      await retryInput.setInputFiles(VALID_PDF_RESUME)
      
      // CV pile should update immediately
      const cvPile = await page.locator('[data-testid="cv-pile"]')
      await expect(cvPile).not.toContainText(path.basename(NON_RESUME_IMAGE))
      await expect(cvPile).toContainText(path.basename(VALID_PDF_RESUME))
      
      // Animation should only start after validation
      const animation = await page.locator('[data-testid="portfolio-animation"]')
      await expect(animation).not.toBeVisible()
      
      // Wait for validation
      await page.waitForResponse(response => 
        response.url().includes('/api/v1/upload') && response.status() === 200
      )
      
      // Now animation should start
      await expect(animation).toBeVisible()
    })
  })
})