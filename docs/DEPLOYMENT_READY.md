# 🚀 EPEP Cloud Run Deployment - READY

Your Election Process Education Platform is **ready to deploy to Google Cloud Run**. 

## Current Status

✅ **Completed:**
- Google Cloud SDK installed (C:\Temp\google-cloud-sdk)
- You authenticated: pranavpanchal1326@gmail.com
- GCP Project created: `bnb-marathon-pranav`
- EPEP built for production (/dist created)
- All deployment files configured

❌ **Awaiting:** Billing account link (takes 2 minutes)

## Quick Start - Deploy Now

### Option 1: Automated Deployment (Recommended)

```bash
cd d:\election\epep
python complete_deployment.py
```

This script will:
1. Ask for your Billing Account ID
2. Link your $5 credits to the project
3. Deploy automatically
4. Give you the live Cloud Run URL

**Total time: 5-10 minutes**

### Option 2: Step by Step

#### Step A: Link Billing (1 minute)

Visit: https://console.cloud.google.com/billing

1. Click "My Billing Accounts"
2. Find account with $5 credits
3. Copy the **Billing Account ID** (e.g., `0X1X2X-XXXXXX-XXXXXX`)
4. Run this command:

```bash
gcloud billing projects link bnb-marathon-pranav --billing-account=YOUR_BILLING_ID
```

Replace `YOUR_BILLING_ID` with the actual ID.

#### Step B: Deploy (5-10 minutes)

```bash
cd d:\election\epep
python deploy.py
```

## Deployment Files

| File | Purpose |
|------|---------|
| `complete_deployment.py` | Automated billing + deployment in one script |
| `deploy.py` | Deployment script (after billing is linked) |
| `link_billing.py` | Link billing helper |
| `Dockerfile` | Multi-stage Docker build (~25MB) |
| `nginx.conf` | Web server config (port 8080, SPA routing) |
| `.dockerignore` | Optimized build context |
| `cloudbuild.yaml` | Cloud Build CI/CD config |

## Project Details

- **Project ID:** `bnb-marathon-pranav`
- **Project Number:** `961326857165`
- **Service:** `epep`
- **Region:** `asia-south1` (Mumbai - best for India)
- **Memory:** 256Mi (sufficient for static files)
- **CPU:** 1 vCPU
- **Scaling:** 0-3 instances (scales to zero when idle)

## Billing Info

- **Your Credits:** $5.00 USD
- **Cloud Run Free Tier:** 2M requests/month + 360,000 vCPU-seconds
- **Estimated Competition Cost:** ~$0.02
- **Remaining Buffer:** ~$4.98

## After Deployment

Once you get the URL (e.g., `https://epep-abc123-el.a.run.app`):

### 1. Test the Deployment

```bash
# Test homepage
curl -I https://epep-abc123-el.a.run.app/

# Test routes
curl -I https://epep-abc123-el.a.run.app/map
curl -I https://epep-abc123-el.a.run.app/quiz
curl -I https://epep-abc123-el.a.run.app/evm
```

All should return `HTTP/2 200`

### 2. Browser Testing

Open the URL in Chrome and verify:
- Homepage loads ✓
- /map page loads ✓
- /quiz page loads ✓
- /evm page loads ✓
- /learn page loads ✓
- Page refresh works (SPA routing) ✓
- AI chat connects to OpenRouter ✓
- PWA install available ✓

### 3. Update README.md

Add this badge at the top:

```markdown
[![Deploy Status](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://YOUR_CLOUD_RUN_URL)

## 🚀 Live Demo

**[Open EPEP on Google Cloud Run](https://YOUR_CLOUD_RUN_URL)**

Hosted on Google Cloud Run (asia-south1 · Mumbai) with Cloud Build
```

### 4. Update Deployment Section in README

```markdown
## Deployment

### Google Cloud Run (Primary - PromptWars 2026)

```bash
# Build
npm run build

# Deploy to Cloud Run
gcloud run deploy epep \
  --source . \
  --region=asia-south1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=256Mi \
  --description="EPEP - Election Process Education Platform"
```

Service URL: `https://epep-XXXXXXXXXX-el.a.run.app`

Auto-deploys via Cloud Build on every push to main.
```

### 5. Add Google Services Table

```markdown
## Google Services Used

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Google Cloud Run** | Containerized application hosting | Primary deployment |
| **Google Cloud Build** | CI/CD pipeline & Docker builds | Automated deployment |
| **Google Artifact Registry** | Docker image storage | Image registry |
| **Google Cloud Storage** | Static asset caching | GeoJSON, fonts, icons |
```

## Troubleshooting

### Q: "Billing account for project is not found"
**A:** Link your billing account first
```bash
gcloud billing projects link bnb-marathon-pranav --billing-account=YOUR_ID
```

### Q: "Service unavailable" (503 on Cloud Run URL)
**A:** Check deployment logs
```bash
gcloud run services logs read epep --region=asia-south1
```

### Q: Routes return 404 on page refresh
**A:** nginx SPA routing issue - rebuild and redeploy

### Q: AI chat not working on Cloud Run
**A:** VITE_OPENROUTER_API_KEY must be set before build
- Verify `.env` has the key
- Rebuild: `npm run build`
- Redeploy: `python deploy.py`

### Q: Cold start too slow
**A:** Add warm instance (costs ~$1.50/month)
```bash
gcloud run services update epep --min-instances=1 --region=asia-south1
```

## Support

For issues with:
- **Google Cloud:** https://cloud.google.com/support
- **EPEP Code:** Check GitHub issues
- **Deployment:** See CLOUD_RUN_SETUP.md for detailed guide

---

## Ready to Deploy?

```bash
cd d:\election\epep
python complete_deployment.py
```

**Let the script handle everything!**
