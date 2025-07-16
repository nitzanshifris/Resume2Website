#!/bin/bash

echo "🚀 Quick CV2WEB API Test"
echo "========================"

# Test health
echo -e "\n1. Health Check:"
curl -s http://localhost:2000/health | jq '.'

# Test registration
echo -e "\n2. Register New User:"
TIMESTAMP=$(date +%s)
EMAIL="test_${TIMESTAMP}@example.com"

RESPONSE=$(curl -s -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"testpass123\"}")

echo $RESPONSE | jq '.'
SESSION_ID=$(echo $RESPONSE | jq -r '.session_id')

# Test file upload (dev mode - no auth needed)
echo -e "\n3. Upload Test File:"
curl -s -X POST http://localhost:2000/api/v1/upload \
  -F "file=@test_files/sample_cv.txt" | jq '.'

echo -e "\n✅ API is working!"