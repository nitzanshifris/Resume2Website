 🔵 TEST SUITE 1: Anonymous User Flows


i did - 


### 1.1 Main Upload Button (Hero Section)
**Steps:**
1. Fresh page load (not logged in)
2. Click "Upload your CV now" button in hero section (blue gradient button with upload icon)
3. Select valid CV file (accepts: .pdf, .doc, .docx, .txt, .rtf, .png, .jpg, .jpeg, .webp, .heic, .heif, .tiff, .bmp)

what happend - the cv file did entered the card in the cv file  the animtion started automaticly.  . after i registsterd in the end of animation no thing happends . 

➜  cv2web-v4 git:(development-flow-rebuild) ✗ python3 -m uvicorn main:app --host 127.0.0.1 --port 2000
INFO:     Started server process [24902]
INFO:     Waiting for application startup.
2025-08-21 15:28:25,797 - main - INFO - Initializing database...
2025-08-21 15:28:25,797 - src.api.db - INFO - file_hash column already exists
2025-08-21 15:28:25,797 - src.api.db - INFO - Created file_hash index
2025-08-21 15:28:25,797 - src.api.db - INFO - Database initialized successfully
2025-08-21 15:28:25,797 - main - INFO - Database initialized successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:2000 (Press CTRL+C to quit)
2025-08-21 15:28:51,673 - passlib.handlers.bcrypt - WARNING - (trapped) error reading bcrypt version
Traceback (most recent call last):
  File "/Users/nitzan_shifris/Library/Python/3.9/lib/python/site-packages/passlib/handlers/bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
AttributeError: module 'bcrypt' has no attribute '__about__'
2025-08-21 15:28:51,894 - src.api.routes.user_auth - INFO - New user registered: l@gmail.com
INFO:     127.0.0.1:59815 - "POST /api/v1/register HTTP/1.1" 200 OK
2025-08-21 15:28:51,898 - src.api.routes.cv - INFO - Anonymous user from IP 127.0.0.1 uploading file: Marketing & Advertising  .png
2025-08-21 15:28:51,898 - src.api.routes.cv - INFO - File validated successfully: image/png
2025-08-21 15:28:51,899 - src.core.local.text_extractor - INFO - Extracting text from tmpbl91sr7j.png (type: .png)
2025-08-21 15:28:51,899 - src.core.local.text_extractor - INFO - Local extraction insufficient, attempting OCR...
2025-08-21 15:28:52,350 - src.core.local.text_extractor - INFO - Google Vision OCR successful: 1795 characters
2025-08-21 15:28:52,352 - src.utils.cv_resume_gate - INFO - Resume Gate: score=83, threshold=60, is_image=True, decision=PASS, top_signals=[section_experience=13, email=10, section_education=10]
2025-08-21 15:28:52,352 - src.api.routes.cv - INFO - Resume Gate passed for anonymous: score=83
2025-08-21 15:28:52,352 - src.api.routes.cv - INFO - File hash calculated: 7a1855a2...
2025-08-21 15:28:52,353 - src.api.routes.cv - INFO - 🎯 CACHE HIT! Using cached extraction for anonymous upload (hash 7a1855a2)
2025-08-21 15:28:52,354 - src.api.routes.cv - INFO - File saved for display: data/uploads/anonymous_328a1b9c689f/b985e9e6-d979-42cf-971b-c2abb0c44cda.png
2025-08-21 15:28:52,354 - src.utils.upload_rate_limiter - INFO - Upload recorded for IP 127.0.0.1
2025-08-21 15:28:52,354 - src.api.routes.cv - INFO - Recorded cached upload for IP 127.0.0.1
INFO:     127.0.0.1:59817 - "POST /api/v1/upload-anonymous HTTP/1.1" 200 OK
INFO:     127.0.0.1:59820 - "GET /api/v1/portfolio/list HTTP/1.1" 200 OK

