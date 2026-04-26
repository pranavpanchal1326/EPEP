# EPEP → Google Cloud Run Deployment Guide

## ⚠️ PREREQUISITES: Install Required Tools

Before deployment, you **must** install these tools on your Windows machine:

### 1. Google Cloud SDK (gcloud CLI)

**Download & Install:**
- Visit: https://cloud.google.com/sdk/docs/install
- Download **Google Cloud SDK Installer for Windows**
- Run the installer (follow all prompts)
- **Important:** At the end of installation, it will ask to initialize gcloud. Click YES.

**Verify Installation:**
```bash
gcloud --version
# Should output: Google Cloud SDK 500.0.0 (or newer)
```

### 2. Docker Desktop (for local testing - OPTIONAL for Cloud Build)

**If you want to test locally before Cloud Run:**
- Download: https://www.docker.com/products/docker-desktop
- Install on Windows (choose WSL 2 backend)
- Restart computer after installation

**Verify:**
```bash
docker --version
# Should output: Docker version 24.0.0 (or newer)
```

---

## ✅ DEPLOYMENT STEPS (Execute in order)

### STEP 1: Google Cloud Setup

```bash
# Login to Google Cloud
gcloud auth login
# This opens a browser - sign in with your Google account (the one with $5 credits)

# Verify login
gcloud auth list
# Should show your email with ACTIVE status
```

### STEP 2: Create or Select GCP Project

```bash
# List existing projects
gcloud projects list

# Create new project (if needed)
gcloud projects create bnb-marathon-pranav \
  --name="EPEP PromptWars 2026"

# Set as active project
gcloud config set project bnb-marathon-pranav

# Verify
gcloud config get-value project
# Should output: bnb-marathon-pranav
```

### STEP 3: Link Billing Account

```bash
# List billing accounts
gcloud billing accounts list
# Example output: 0X1X2X-XXXXXX-XXXXXX  My Billing Account  True

# Link billing to project (replace BILLING_ACCOUNT_ID)
gcloud billing projects link bnb-marathon-pranav \
  --billing-account=0X1X2X-XXXXXX-XXXXXX
# Wait 30 seconds...
# Success: Link operation completed successfully
```

### STEP 4: Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

# Wait 30-60 seconds. Should see: "Operation finished successfully"
```

### STEP 5: Deploy to Cloud Run

Now you can deploy using **two approaches**:

#### OPTION A: Cloud Build (RECOMMENDED - no Docker needed locally)

```bash
# From D:\election\epep directory
cd D:\election\epep

# Create cloudbuild.yaml
# (We'll create this file in the next step)

# Deploy directly from GitHub (recommended) or local build
gcloud run deploy epep \
  --source . \
  --region=asia-south1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --timeout=30 \
  --description="EPEP — Election Process Education Platform | Google PromptWars 2026"
```

Cloud Build will:
1. Build the Docker image using our Dockerfile
2. Push to Artifact Registry
3. Deploy to Cloud Run
4. Give you a public URL

**Wait for: "Service URL: https://epep-XXXXXXXXXX-el.a.run.app"**

#### OPTION B: Manual Build & Push (if Docker is installed)

```bash
# Build locally
docker build -t epep:local .

# Test locally
docker run -p 8080:8080 epep:local
# Open: http://localhost:8080 - verify it works
# Ctrl+C to stop

# Setup Docker auth
gcloud auth configure-docker asia-south1-docker.pkg.dev

# Create Artifact Registry repo
gcloud artifacts repositories create epep-repo \
  --repository-format=docker \
  --location=asia-south1

# Tag image
docker tag epep:local \
  asia-south1-docker.pkg.dev/bnb-marathon-pranav/epep-repo/epep:latest

# Push to Google Cloud
docker push \
  asia-south1-docker.pkg.dev/bnb-marathon-pranav/epep-repo/epep:latest

# Deploy to Cloud Run
gcloud run deploy epep \
  --image=asia-south1-docker.pkg.dev/bnb-marathon-pranav/epep-repo/epep:latest \
  --platform=managed \
  --region=asia-south1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --timeout=30
```

---

## 🎯 After Deployment

Once you see the URL (something like `https://epep-abc123xyz-el.a.run.app`):

### Test Every Route

```bash
# Get your service URL
gcloud run services describe epep --region=asia-south1 --format='value(status.url)'

# Test routes (replace URL with yours)
curl -I https://epep-abc123xyz-el.a.run.app/
curl -I https://epep-abc123xyz-el.a.run.app/map
curl -I https://epep-abc123xyz-el.a.run.app/quiz
curl -I https://epep-abc123xyz-el.a.run.app/evm
# All should return HTTP 200
```

### Open in Browser

- Open each URL in Chrome
- Verify all pages load
- Test AI chat (should connect to OpenRouter)
- Refresh pages (SPA routing should work)

### Update README.md

```markdown
## 🚀 Live Demo

[![Deploy Status](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://epep-XXXXXXXXXX-el.a.run.app)

**[📍 Open EPEP on Google Cloud Run](https://epep-XXXXXXXXXX-el.a.run.app)**

Hosted on Google Cloud Run (asia-south1 · Mumbai) with Cloud Build CI/CD
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Service unavailable" (503) | Check logs: `gcloud run services logs read epep --region=asia-south1` |
| Routes return 404 on refresh | nginx.conf SPA routing issue - rebuild and redeploy |
| "PERMISSION_DENIED" pushing | Run: `gcloud auth configure-docker asia-south1-docker.pkg.dev` |
| AI chat not working | API key must be in `.env` before `npm run build` |
| Cold start too slow | Add `--min-instances=1` (costs ~$1.50/month) |

---

## 💰 Budget Tracking

**Your Budget: $5.00 USD**

Estimated costs:
- Static file serving: ~$0.02 per 10,000 requests
- Storage: ~$0.10/month for Cloud Artifact Registry
- Cloud Run free tier: 2M requests/month + 360,000 vCPU-seconds = included

**Remaining buffer: ~$4.88 after competition**

Set budget alert:
```bash
# In Google Cloud Console → Billing → Budgets & Alerts
# Create alert at $4.00 (80% of budget)
```

---

## ✨ What's Already Done

✅ `nginx.conf` - configured for port 8080, SPA routing, caching
✅ `Dockerfile` - multi-stage build, ~25MB final image
✅ `.dockerignore` - excludes unnecessary files
✅ `npm run build` - verified, /dist created
✅ `.env` - VITE_OPENROUTER_API_KEY configured

**Next: Install gcloud + Docker, then run deployment commands above**
