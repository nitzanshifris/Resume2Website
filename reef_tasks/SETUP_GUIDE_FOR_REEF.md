# 🚀 CV2WEB Setup Guide for Reef

Hey Reef! Here's everything you need to get both the main website and portfolio template running on your Mac.

**Last Updated**: January 22, 2025 | **Version**: 4.6

## 📋 Prerequisites

Before you start, make sure you have these installed on your Mac:

### 1. Install Homebrew (if you don't have it)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js (v18 or higher)
```bash
brew install node
# Verify installation
node --version  # Should show v18.x.x or higher
```

### 3. Install pnpm (IMPORTANT: We use pnpm, NOT npm!)
```bash
npm install -g pnpm
# Verify installation
pnpm --version  # Should show 8.x.x or higher
```

### 4. Install Python 3.11+
```bash
brew install python@3.11
# Verify installation
python3 --version  # Should show Python 3.11.x or higher
```

### 5. Install Git (if not already installed)
```bash
brew install git
```

## 🔧 Initial Setup

### 1. Clone the Repository
```bash
cd ~/Desktop  # or wherever you want to put the project
git clone https://github.com/nitzanshifris/cv2web-v4.git
cd cv2web-v4
```

### 2. Create Required Directories
Some directories are in .gitignore, so you need to create them:
```bash
mkdir -p data/uploads
mkdir -p data/test_outputs
mkdir -p data/generated_portfolios
mkdir -p sandboxes/portfolios
mkdir -p logs
mkdir -p tests/outputs
mkdir -p tests/results
mkdir -p .taskmaster/tasks
mkdir -p .taskmaster/research
mkdir -p credentials
```

### 3. Install Frontend Dependencies
```bash
# Install all dependencies using pnpm
pnpm install
```

## 📁 Important Files NOT in GitHub

These files contain sensitive data or are user-specific, so they're not in the repository. You'll need to create them:

### 1. Environment Files
- `.env` (for backend)
- `.env.local` (for frontend)
- Any Google service account JSON files

### 2. Database Files
- The SQLite database will be created automatically when you run the backend
- Location: `cv2web.db` in the root directory

### 3. User Data Directories (already created above)
- `data/uploads/` - Where uploaded CVs are stored
- `data/generated_portfolios/` - Where generated portfolios are saved
- `logs/` - Application logs

### 4. Example CV Files
⚠️ **IMPORTANT**: The `data/cv_examples/` directory contains example CVs for testing. Ask Nitzan if you need these files, or you can use your own test CVs.

## 🔒 Security Configuration (NEW!)

Before running any services, be aware of the recent security updates:

### Security Best Practices
- All file uploads are validated with strict regex patterns
- Path traversal protection is enforced on all file operations
- User IDs and portfolio IDs have strict format validation
- Database operations use parameterized queries
- Subprocess operations are secured with shell=False

## 🌐 Running the User Website (user_web_example)

### Step 1: Navigate to the user website directory
```bash
cd user_web_example
```

### Step 2: Install dependencies (if not done by root pnpm install)
```bash
pnpm install
```

### Step 3: Create Environment Variables
Create a file called `.env.local` in the `user_web_example` directory:
```bash
touch .env.local
```

Add these lines to `.env.local` (ask Nitzan for actual values):
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:2000

# Google OAuth (optional - for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Step 4: Run the User Website
```bash
pnpm run dev
```

The website should now be running at: **http://localhost:3000** 🎉

## 🎨 Running the Portfolio Template (v0_template_1.3)

**Note**: We now have multiple template versions. The latest is v0_template_1.3 which includes:
- Enhanced animations and UI components
- Better CV data integration
- Theme customization support
- Improved mobile responsiveness

### Step 1: Open a new terminal tab/window
Keep the user website running in the first terminal.

### Step 2: Navigate to the template directory
```bash
cd ~/Desktop/cv2web-v4  # Go back to root
cd src/templates/v0_template_1.3  # Latest template version
```

### Step 3: Install template dependencies
```bash
pnpm install
```

### Step 4: Run the Portfolio Template
```bash
pnpm run dev
```

⚠️ **IMPORTANT**: This will try to run on port 3000, but that's already taken by the user website!
You'll see a message asking if you want to run on a different port. Type `y` and press Enter.

The portfolio template should now be running at: **http://localhost:3001** (or another port) 🎉

## 🐍 Running the Backend (Optional - if you need API functionality)

### Step 1: Open another terminal tab/window

### Step 2: Go to project root
```bash
cd ~/Desktop/cv2web-v4
```

### Step 3: Create Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # Activate the virtual environment
```

### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Create Backend Environment File
Create a file called `.env` in the root directory:
```bash
touch .env
```

Add these lines (ask Nitzan for API keys):
```env
# API Keys (ask Nitzan for these)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GOOGLE_APPLICATION_CREDENTIALS=path_to_google_credentials.json

# Database
DATABASE_URL=sqlite:///./cv2web.db

# Session Secret
SECRET_KEY=your_secret_key_here
```

### Step 6: Initialize the Database
```bash
python3 src/utils/init_db.py
```

### Step 7: Run the Backend
```bash
python3 main.py
# OR
uvicorn main:app --reload --port 2000
```

The backend API should now be running at: **http://localhost:2000** 🚀

## 📝 Summary of Running Services

After following all steps, you should have:

1. **User Website**: http://localhost:3000
2. **Portfolio Template**: http://localhost:3001 (or another port)
3. **Backend API** (optional): http://localhost:2000

## 🏗️ API Route Structure (Updated!)

The API routes have been reorganized for better clarity:

### Active Routes
- `/api/v1/portfolio/*` - Main portfolio generation endpoints (NOT `/api/v1/portfolios/*`)
- `/api/v1/cv/*` - CV upload and management
- `/api/v1/download/*` - File download endpoints
- `/api/v1/my-cvs` - List user's CVs

### Future Use Routes (not mounted yet)
- Portfolio Expert API - AI-powered portfolio guidance
- Portfolio Generator V2 - Enhanced template selection
- Demo Preview - For non-authenticated users

## 🛠️ Troubleshooting

### Common Issues:

1. **"Port already in use" error**
   ```bash
   # Find what's using the port (e.g., 3000)
   lsof -ti:3000
   # Kill the process
   kill -9 $(lsof -ti:3000)
   ```

2. **"Cannot find module" errors**
   - Make sure you ran `pnpm install` in the correct directory
   - Try deleting `node_modules` and running `pnpm install` again

3. **Python import errors**
   - Make sure your virtual environment is activated: `source venv/bin/activate`
   - Reinstall requirements: `pip install -r requirements.txt`

4. **"pnpm: command not found"**
   - Make sure you installed pnpm globally: `npm install -g pnpm`

5. **TypeScript errors**
   - Run `pnpm run typecheck` to see all TypeScript errors
   - Most can be ignored for development

6. **Backend API not connecting**
   - Make sure backend is running on port 2000 (NOT 8000)
   - Check that NEXT_PUBLIC_API_URL is set to http://localhost:2000

7. **File upload errors**
   - Check that upload directories exist (run the mkdir commands)
   - Ensure files are under 10MB limit
   - Only allowed extensions: PDF, DOCX, PNG, JPG, JPEG, WEBP

## 🎯 Quick Commands Reference

```bash
# Start user website
cd user_web_example && pnpm run dev

# Start portfolio template (in new terminal)
cd src/templates/v0_template_1.3 && pnpm run dev

# Start backend (in new terminal)
source venv/bin/activate && python3 main.py

# Install dependencies
pnpm install  # For frontend
pip install -r requirements.txt  # For backend

# Check if services are running
curl http://localhost:3000  # User website
curl http://localhost:3001  # Portfolio template
curl http://localhost:2000/health  # Backend API

# TypeScript checking (IMPORTANT!)
pnpm run typecheck  # Run before committing

# View API documentation
open http://localhost:2000/docs  # Interactive API docs (backend must be running)
```

## 📞 Need Help?

If you run into any issues:
1. Check the error message carefully
2. Try the troubleshooting steps above
3. Message Nitzan with:
   - The exact error message
   - Which step you were on
   - What command you ran

Good luck! 🚀 Let me know if you need any clarification or run into issues.

## 🆕 Recent Changes

### Version 4.6 (January 22, 2025)
- Added critical security fixes for path traversal and input validation
- Reorganized API routes into active/archived/future_use directories
- Fixed API paths from `/api/v1/portfolios/*` to `/api/v1/portfolio/*`
- Added new portfolio template v0_template_1.3 with enhanced features

### What's Coming Next
- Payment system integration (Stripe/PayPal)
- Portfolio Expert AI guidance (currently in future_use)
- Enhanced template selection system
- Vercel deployment automation

---
*Created with ❤️ by Nitzan for Reef | Updated: January 22, 2025*