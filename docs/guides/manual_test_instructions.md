# Manual Test Instructions for CV to Portfolio

## Step 1: Start the API Server
Open a new terminal and run:
```bash
cd /Users/nitzan_shifris/Desktop/RESUME2WEBSITE-V4
python3 main.py
```

Wait until you see: "Starting RESUME2WEBSITE API on 127.0.0.1:2000"

## Step 2: Run the Test Script
In another terminal, run:
```bash
cd /Users/nitzan_shifris/Desktop/RESUME2WEBSITE-V4
python3 test_pdf_to_portfolio.py
```

## Step 3: View the Generated Portfolio
After the script completes successfully, it will show you commands like:

```bash
cd /Users/nitzan_shifris/Desktop/RESUME2WEBSITE-V4/portfolio_output
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Alternative: Manual API Test

If the script doesn't work, you can test manually:

1. **Register a user:**
```bash
curl -X POST http://127.0.0.1:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

2. **Upload CV and generate portfolio:**
```bash
# Replace SESSION_ID with the session_id from step 1
curl -X POST http://127.0.0.1:2000/api/v1/cv-to-portfolio/process \
  -H "X-Session-ID: SESSION_ID" \
  -F "file=@data/cv_examples/pdf_examples/pdf/Software Engineer.pdf"
```

3. **Download portfolio:**
```bash
# Replace JOB_ID with the job_id from step 2
curl -X GET http://127.0.0.1:2000/api/v1/cv-to-portfolio/download/JOB_ID \
  -H "X-Session-ID: SESSION_ID" \
  -o portfolio.zip
```

4. **Extract and run:**
```bash
unzip portfolio.zip -d portfolio_output
cd portfolio_output
npm install
npm run dev
```

## What You Should See

The generated portfolio will include:
- Hero section with name and title
- Experience timeline
- Skills grid
- Projects showcase
- Contact information
- All styled with Aceternity components

The Universal Adapter automatically:
- Selects appropriate components for each CV section
- Adapts the data to fit component requirements
- Falls back intelligently (e.g., WobbleCard instead of BentoGrid for <3 items)