#!/bin/bash

# CV2WEB Pipeline - Step by Step Test
# This tests the ACTUAL endpoints in order

echo "=========================================="
echo "CV2WEB PIPELINE - STEP BY STEP TEST"
echo "=========================================="

# Base URL
BASE_URL="http://localhost:2000"

# Test data
EMAIL="test$(date +%s)@example.com"  # Unique email each time
PASSWORD="testpassword123"  # At least 8 characters

echo -e "\n📝 Step 1: REGISTER NEW USER"
echo "Endpoint: POST /api/v1/register"
echo "Script: src/api/routes/cv.py - register() function"
echo "Input: email=$EMAIL, password=$PASSWORD"
echo "----------------------------------------"

REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Response: $REGISTER_RESPONSE"

# Extract session_id using grep and sed
SESSION_ID=$(echo $REGISTER_RESPONSE | grep -o '"session_id":"[^"]*' | sed 's/"session_id":"//')
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"user_id":"[^"]*' | sed 's/"user_id":"//')

if [ -z "$SESSION_ID" ]; then
    echo "❌ Registration failed!"
    exit 1
fi

echo "✅ Success! Session ID: $SESSION_ID"
echo "           User ID: $USER_ID"

echo -e "\n📝 Step 2: LOGIN (optional - we already have session)"
echo "Endpoint: POST /api/v1/login"
echo "Script: src/api/routes/cv.py - login() function"
echo "----------------------------------------"

LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Response: $LOGIN_RESPONSE"

echo -e "\n📝 Step 3: UPLOAD CV WITH ENHANCED TRACKING"
echo "Endpoint: POST /api/v1/cv-enhanced/upload"
echo "Script: src/api/routes/cv_enhanced.py - upload_cv_with_tracking()"
echo "Using CV: data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf"
echo "----------------------------------------"

UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/cv-enhanced/upload \
  -H "X-Session-ID: $SESSION_ID" \
  -F "file=@data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf")

echo "Response: $UPLOAD_RESPONSE"

# Extract job_id
JOB_ID=$(echo $UPLOAD_RESPONSE | grep -o '"job_id":"[^"]*' | sed 's/"job_id":"//')

if [ -n "$JOB_ID" ]; then
    echo "✅ Success! Job ID: $JOB_ID"
else
    echo "⚠️  Upload might have failed. Checking standard upload endpoint..."
    
    # Try standard upload endpoint
    echo -e "\n📝 Step 3b: STANDARD CV UPLOAD"
    echo "Endpoint: POST /api/v1/upload"
    echo "Script: src/api/routes/cv.py - upload_cv()"
    echo "----------------------------------------"
    
    UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/upload \
      -H "X-Session-ID: $SESSION_ID" \
      -F "file=@data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf")
    
    echo "Response: $UPLOAD_RESPONSE"
    JOB_ID=$(echo $UPLOAD_RESPONSE | grep -o '"job_id":"[^"]*' | sed 's/"job_id":"//')
fi

echo -e "\n📝 Step 4: CHECK SSE HEARTBEAT"
echo "Endpoint: GET /api/v1/sse/heartbeat"
echo "Script: src/api/routes/sse.py - sse_heartbeat()"
echo "----------------------------------------"

echo "Connecting to SSE stream (showing 3 heartbeats)..."
timeout 7 curl -N $BASE_URL/api/v1/sse/heartbeat 2>/dev/null | head -n 12

echo -e "\n\n📝 Step 5: GET WORKFLOW METRICS"
echo "Endpoint: GET /api/v1/workflows/metrics"
echo "Script: src/api/routes/workflows.py - get_workflow_metrics()"
echo "----------------------------------------"

METRICS_RESPONSE=$(curl -s $BASE_URL/api/v1/workflows/metrics?time_window_minutes=5)
echo "Response: $METRICS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$METRICS_RESPONSE"

echo -e "\n📝 Step 6: CHECK PORTFOLIO GENERATION ENDPOINT"
echo "Endpoint: POST /api/v1/portfolio/generate"
echo "Script: src/api/routes/portfolio.py - generate_portfolio()"
echo "----------------------------------------"

# Check if endpoint exists
curl -s -I -X POST $BASE_URL/api/v1/portfolio/generate | head -n 1

echo -e "\n=========================================="
echo "✅ PIPELINE TEST COMPLETE!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- User registered: $EMAIL"
echo "- Session ID: $SESSION_ID"
echo "- Job ID: $JOB_ID"
echo ""
echo "🔍 Check your server terminal to see:"
echo "- Enhanced logging messages (🚀 STEP, ✅ COMPLETED, etc)"
echo "- Performance metrics"
echo "- Correlation tracking"