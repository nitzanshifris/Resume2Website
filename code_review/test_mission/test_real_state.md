 🔵 TEST SUITE 1: Anonymous User Flows


i did - 


### 1.1 Main Upload Button (Hero Section)
**Steps:**
1. Fresh page load (not logged in)
2. Click "Upload your CV now" button in hero section (blue gradient button with upload icon)
3. Select valid CV file (accepts: .pdf, .doc, .docx, .txt, .rtf, .png, .jpg, .jpeg, .webp, .heic, .heif, .tiff, .bmp)

what happend - the cv file did entered the card in the cv file  the animtion started automaticly.  . after i registsterd in the end of animation the vertical progress bar jumped straitly to 60% (very bad!) and the extraction+generation has began in my backend . when the generation completed , nothing in my front user web ui has changed .


terminal logs - ➜  cv2web-v4 git:(development-flow-rebuild) python3 -m uvicorn main:app --host 127.0.0.1 --port 2000
INFO:     Started server process [30152]
INFO:     Waiting for application startup.
2025-08-21 15:46:28,121 - main - INFO - Initializing database...
2025-08-21 15:46:28,121 - src.api.db - INFO - file_hash column already exists
2025-08-21 15:46:28,121 - src.api.db - INFO - Created file_hash index
2025-08-21 15:46:28,121 - src.api.db - INFO - Database initialized successfully
2025-08-21 15:46:28,121 - main - INFO - Database initialized successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:2000 (Press CTRL+C to quit)
INFO:     127.0.0.1:61007 - "OPTIONS /api/v1/logout HTTP/1.1" 200 OK
2025-08-21 15:47:48,266 - src.api.routes.user_auth - INFO - User logged out, session deleted: 5a76b189-9dba-4098-bfbb-56d839f8156a
INFO:     127.0.0.1:61007 - "POST /api/v1/logout HTTP/1.1" 200 OK
2025-08-21 15:47:55,110 - src.api.routes.cv - INFO - Anonymous user from IP 127.0.0.1 uploading file: retail-business-development-1615965233-pdf.jpg
2025-08-21 15:47:55,110 - src.api.routes.cv - INFO - File validated successfully: image/jpeg
2025-08-21 15:47:55,111 - src.core.local.text_extractor - INFO - Extracting text from tmpssnygw8i.jpg (type: .jpg)
2025-08-21 15:47:55,111 - src.core.local.text_extractor - INFO - Local extraction insufficient, attempting OCR...
2025-08-21 15:47:55,588 - src.core.local.text_extractor - INFO - Google Vision OCR successful: 2468 characters
2025-08-21 15:47:55,589 - src.utils.cv_resume_gate - INFO - Resume Gate: score=76, threshold=60, is_image=True, decision=PASS, top_signals=[section_experience=13, email=10, section_education=10]
2025-08-21 15:47:55,589 - src.api.routes.cv - INFO - Resume Gate passed for anonymous: score=76
2025-08-21 15:47:55,590 - src.api.routes.cv - INFO - File hash calculated: 981e8888...
2025-08-21 15:47:55,591 - src.api.routes.cv - INFO - 🎯 CACHE HIT! Using cached extraction for anonymous upload (hash 981e8888)
2025-08-21 15:47:55,592 - src.api.routes.cv - INFO - File saved for display: data/uploads/anonymous_4d3ac3256c9a/9396af51-7d91-4e32-843c-fde54cf78abb.jpg
2025-08-21 15:47:55,592 - src.utils.upload_rate_limiter - INFO - Upload recorded for IP 127.0.0.1
2025-08-21 15:47:55,592 - src.api.routes.cv - INFO - Recorded cached upload for IP 127.0.0.1
INFO:     127.0.0.1:61023 - "POST /api/v1/upload-anonymous HTTP/1.1" 200 OK
INFO:     127.0.0.1:61028 - "GET /api/v1/auth/google/status HTTP/1.1" 200 OK
INFO:     127.0.0.1:61032 - "OPTIONS /api/v1/register HTTP/1.1" 200 OK
2025-08-21 15:48:22,181 - passlib.handlers.bcrypt - WARNING - (trapped) error reading bcrypt version
Traceback (most recent call last):
  File "/Users/nitzan_shifris/Library/Python/3.9/lib/python/site-packages/passlib/handlers/bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
AttributeError: module 'bcrypt' has no attribute '__about__'
2025-08-21 15:48:22,404 - src.api.routes.user_auth - INFO - New user registered: jsx@gmail.com
INFO:     127.0.0.1:61032 - "POST /api/v1/register HTTP/1.1" 200 OK
INFO:     127.0.0.1:61032 - "OPTIONS /api/v1/claim HTTP/1.1" 200 OK
2025-08-21 15:48:22,407 - src.api.routes.cv - INFO - 🔄 User 44881c15-2747-47bf-b91d-7368a15df2b8 attempting to claim CV with job_id: 9396af51-7d91-4e32-843c-fde54cf78abb
2025-08-21 15:48:22,408 - src.api.db - INFO - Successfully transferred CV 9396af51-7d91-4e32-843c-fde54cf78abb from anonymous_4d3ac3256c9a to 44881c15-2747-47bf-b91d-7368a15df2b8
2025-08-21 15:48:22,408 - src.api.routes.cv - INFO - ✅ Successfully transferred CV 9396af51-7d91-4e32-843c-fde54cf78abb from anonymous_4d3ac3256c9a to 44881c15-2747-47bf-b91d-7368a15df2b8
INFO:     127.0.0.1:61034 - "POST /api/v1/claim HTTP/1.1" 200 OK
INFO:     127.0.0.1:61032 - "OPTIONS /api/v1/extract/9396af51-7d91-4e32-843c-fde54cf78abb HTTP/1.1" 200 OK
INFO:     127.0.0.1:61032 - "OPTIONS /api/v1/portfolio/list HTTP/1.1" 200 OK
2025-08-21 15:48:22,440 - src.api.routes.cv - INFO - Extract CV endpoint called for job_id: 9396af51-7d91-4e32-843c-fde54cf78abb, user: 44881c15-2747-47bf-b91d-7368a15df2b8
INFO:     127.0.0.1:61034 - "POST /api/v1/extract/9396af51-7d91-4e32-843c-fde54cf78abb HTTP/1.1" 200 OK
INFO:     127.0.0.1:61038 - "GET /api/v1/portfolio/list HTTP/1.1" 200 OK
INFO:     127.0.0.1:61032 - "OPTIONS /api/v1/portfolio/generate/9396af51-7d91-4e32-843c-fde54cf78abb HTTP/1.1" 200 OK
2025-08-21 15:48:22,470 - src.api.routes.portfolio_generator - INFO - 🚀 Started portfolio cleanup task
2025-08-21 15:48:25,495 - src.api.routes.portfolio_generator - INFO - 🧹 Cleaned up zombie process PID: 1471
2025-08-21 15:48:25,499 - src.api.routes.portfolio_generator - INFO - 🧹 Cleaned up zombie process PID: 25443
2025-08-21 15:48:25,504 - src.api.routes.portfolio_generator - INFO - 🧹 Cleaned up zombie process PID: 25817
2025-08-21 15:48:25,509 - src.api.routes.portfolio_generator - INFO - 🧹 Cleaned up zombie process PID: 30076
2025-08-21 15:48:25,509 - src.api.routes.portfolio_generator - INFO - 🚀 Starting portfolio generation for job_id: 9396af51-7d91-4e32-843c-fde54cf78abb, user: 44881c15-2747-47bf-b91d-7368a15df2b8
2025-08-21 15:48:25,512 - src.api.routes.portfolio_generator - INFO - 📊 Checking database for CV data for job_id: 9396af51-7d91-4e32-843c-fde54cf78abb
2025-08-21 15:48:25,513 - src.api.routes.portfolio_generator - INFO - ✅ Found CV data in database for job 9396af51-7d91-4e32-843c-fde54cf78abb
2025-08-21 15:48:25,513 - src.api.routes.portfolio_generator - INFO - 📁 Created sandbox directory: /Users/nitzan_shifris/Desktop/CV2WEB-V4/sandboxes/portfolios/44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📋 Copied template from /Users/nitzan_shifris/Desktop/CV2WEB-V4/src/templates/v0_template_v1.5 to /Users/nitzan_shifris/Desktop/CV2WEB-V4/sandboxes/portfolios/44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📝 Creating vercel.json with iframe configuration...
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - ✅ Created vercel.json with env configuration (headers handled by middleware)
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 💉 Injecting CV data into template...
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📊 CV data available: ['hero', 'contact', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications', 'languages', 'courses', 'volunteer', 'publications', 'speaking', 'hobbies', 'unclassified_text']
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📊 Hero name: SOPHIA BROWN
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - ✅ CV data injected into /Users/nitzan_shifris/Desktop/CV2WEB-V4/sandboxes/portfolios/44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6/lib/injected-data.tsx
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📋 Template will use real CV data via adaptResume2WebsiteToTemplate()
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 📦 Installing dependencies with clean install and @dnd-kit peer dependency fix...
2025-08-21 15:48:40,635 - src.api.routes.portfolio_generator - INFO - 🧹 Cleaning existing node_modules...
2025-08-21 15:48:43,330 - src.api.routes.portfolio_generator - INFO - 🧹 Removing pnpm-lock.yaml...
2025-08-21 15:48:43,330 - src.api.routes.portfolio_generator - INFO - 🧹 Removing package-lock.json...
2025-08-21 15:48:43,330 - src.api.routes.portfolio_generator - INFO - 📦 Running: npm install --legacy-peer-deps
2025-08-21 15:48:56,612 - src.api.routes.portfolio_generator - INFO - ✅ npm install succeeded
2025-08-21 15:48:56,612 - src.api.routes.portfolio_generator - INFO - 📦 Verifying Next.js installation...
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO - 📦 Verifying @dnd-kit dependencies...
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO - ✅ @dnd-kit/accessibility already present
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO - ✅ Dependencies installation completed
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO - 🚀 Preparing for Vercel deployment...
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved tailwindcss to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved postcss to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved typescript to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved @types/node to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved @types/react to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Moved @types/react-dom to dependencies
2025-08-21 15:48:56,779 - src.api.routes.portfolio_generator - INFO -    ✅ Fixed date-fns to ^3.6.0
2025-08-21 15:48:56,780 - src.api.routes.portfolio_generator - INFO -    ✅ Updated package.json for Vercel
2025-08-21 15:48:56,780 - src.api.routes.portfolio_generator - INFO -    ✅ Created .npmrc with legacy-peer-deps
2025-08-21 15:48:56,780 - src.api.routes.portfolio_generator - INFO -    ✅ Updated package.json
2025-08-21 15:48:56,780 - src.api.routes.portfolio_generator - INFO - 🌐 Starting local portfolio server for preview...
2025-08-21 15:48:56,781 - src.api.routes.portfolio_generator - INFO - 🚀 Starting server with command: /Users/nitzan_shifris/Desktop/CV2WEB-V4/sandboxes/portfolios/44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6/node_modules/next/dist/bin/next dev on port 4000
2025-08-21 15:48:56,785 - src.api.routes.portfolio_generator - INFO - ✅ Process started with PID: 30556
2025-08-21 15:48:56,785 - src.api.routes.portfolio_generator - INFO - ⏳ Waiting for server to be ready on http://localhost:4000...
2025-08-21 15:48:57,135 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ▲ Next.js 15.2.4
2025-08-21 15:48:57,135 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] - Local:        http://localhost:4000
2025-08-21 15:48:57,135 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] - Network:      http://192.168.1.145:4000
2025-08-21 15:48:57,135 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ✓ Starting...
2025-08-21 15:48:58,719 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ✓ Ready in 1652ms
2025-08-21 15:48:59,297 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ○ Compiling / ...
2025-08-21 15:49:04,468 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ✓ Compiled / in 5.7s (3734 modules)
2025-08-21 15:49:05,421 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] ✓ Compiled in 932ms (1712 modules)
2025-08-21 15:49:05,835 - src.api.routes.portfolio_generator - INFO - ✅ Server ready for 44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6 on port 4000 (took 9.0s)
2025-08-21 15:49:05,835 - src.api.routes.portfolio_generator - INFO - ✅ Portfolio server successfully started on port 4000
2025-08-21 15:49:05,835 - src.api.routes.portfolio_generator - INFO - [44881c15-2747-47bf-b91d-7368a15df2b8_9396af51-7d91-4e32-843c-fde54cf78abb_37abcbf6:OUT] GET / 200 in 38ms
2025-08-21 15:49:05,838 - src.api.routes.portfolio_generator - INFO - 🎉 Portfolio preview ready in 43.4s
2025-08-21 15:49:05,838 - src.api.routes.portfolio_generator - INFO - 👁️ Preview at: http://localhost:4000
INFO:     127.0.0.1:61038 - "POST /api/v1/portfolio/generate/9396af51-7d91-4e32-843c-fde54cf78abb HTTP/1.1" 200 OK
2025-08-21 15:49:05,838 - src.api.routes.portfolio_generator - INFO - 🧹 Running portfolio cleanup task

