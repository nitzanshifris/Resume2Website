# CV2WEB API Documentation

## Base URL
```
Development: http://localhost:2000
Production: https://api.cv2web.com (update when deployed)
```

## Request Format
All authentication endpoints (`/register`, `/login`) now accept **JSON** instead of form data.

## Authentication

### Register New User
```bash
curl -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure_password123"}'

# Response:
{
  "message": "Registration successful",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Login
```bash
curl -X POST http://localhost:2000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure_password123"}'

# Response:
{
  "message": "Login successful",
  "session_id": "660e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

## CV Processing

### Upload CV
```bash
# With authentication (always required)
curl -X POST http://localhost:2000/api/v1/upload \
  -H "X-Session-ID: your-session-id-here" \
  -F "file=@/path/to/your/cv.pdf"

# Response:
{
  "message": "CV uploaded successfully. Building your portfolio website...",
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "cv_data": {
    "sections_extracted": 17,
    "archetype": "Technical Developer",
    "components_selected": 8
  }
}
```

**Note:** Authentication is always required. Use the session_id from login/register.

## Portfolio Generation

### Generate Portfolio
```bash
curl -X POST http://localhost:2000/api/v1/portfolio/generate \
  -H "X-Session-ID: your-session-id-here" \
  -H "Content-Type: application/json" \
  -d '{
    "cv_data_id": "123e4567-e89b-12d3-a456-426614174000",
    "theme": "dark",
    "components": ["background-gradient", "timeline", "bento-grid"]
  }'

# Response:
{
  "message": "Portfolio generated successfully",
  "portfolio_id": "880e8400-e29b-41d4-a716-446655440000",
  "preview_url": "http://localhost:3000/preview/880e8400",
  "download_url": "/api/v1/portfolio/download/880e8400"
}
```

### Download Generated Portfolio
```bash
curl -X GET http://localhost:2000/api/v1/portfolio/download/880e8400 \
  -H "X-Session-ID: your-session-id-here" \
  -o portfolio.zip
```

### Supported File Types
- Documents: `.pdf`, `.docx`, `.doc`, `.txt`, `.md`, `.rtf`, `.odt`, `.html`, `.htm`
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`, `.tiff`, `.tif`, `.bmp`

### File Size Limit
- Maximum: 10MB

## Maintenance (Development Only)

### Clean Old Sessions
```bash
curl -X DELETE http://localhost:2000/api/v1/cleanup

# Response:
{
  "status": "success",
  "deleted_sessions": 42,
  "cutoff_date": "2024-01-10T15:30:00"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "File is empty"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid session. Please login"
}
```

### 413 Payload Too Large
```json
{
  "detail": "File too large. Maximum size is 10.0MB"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Processing failed. Please try again later"
}
```

## Testing Tips

### Quick Test File Upload (Development)
```bash
# Create a test text file
echo "John Doe - Software Engineer" > test_cv.txt

# Upload it
curl -X POST http://localhost:2000/api/v1/upload -F "file=@test_cv.txt" -H "X-Session-ID: your-session-id"
```

### Test with Different File Types
```bash
# PDF
curl -X POST http://localhost:2000/api/v1/upload -F "file=@resume.pdf" -H "X-Session-ID: $SESSION_ID"

# Image (will trigger OCR)
curl -X POST http://localhost:2000/api/v1/upload -F "file=@scanned_cv.jpg" -H "X-Session-ID: $SESSION_ID"

# Word Document
curl -X POST http://localhost:2000/api/v1/upload -F "file=@cv.docx" -H "X-Session-ID: $SESSION_ID"
```

### Save Session ID for Reuse
```bash
# Login and save session
SESSION_ID=$(curl -s -X POST http://localhost:2000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass"}' \
  | grep -o '"session_id":"[^"]*' \
  | grep -o '[^"]*$')

# Use it
curl -X POST http://localhost:2000/api/v1/upload \
  -H "X-Session-ID: $SESSION_ID" \
  -F "file=@cv.pdf"
```

## Configuration

Configuration is centralized in `config.py`. Key settings:
- Port: 2000
- Max upload size: 10MB
- Session expiry: 7 days
- Allowed origins: localhost:3000, 3001, 5173

## Notes

- Authentication is always required (no bypass mode)
- All timestamps are in UTC
- Sessions persist between server restarts (stored in SQLite)
- Uploaded files are saved in `data/uploads/` directory with UUID names
- Extracted CV data is temporarily saved in `data/outputs/` as JSON