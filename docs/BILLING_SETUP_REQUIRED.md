# ⚠️ BILLING ACCOUNT REQUIRED

The Cloud Run deployment requires a billing account to be linked to the project.

**Good news:** You have $5 in Google Cloud credits - they just need to be linked.

## QUICK FIX: Link Billing in 2 Minutes

### Step 1: Open Google Cloud Console
Open in browser: https://console.cloud.google.com/billing/linkedaccounts

### Step 2: Find Your Billing Account
- Look for "My Billing Accounts"
- Find the account with your $5 credits (might show as "Free Trial" or "$5 Credit")
- **Copy the Billing Account ID** (format: `0X1X2X-XXXXXX-XXXXXX`)

### Step 3: Link to Project
Run this command with YOUR_BILLING_ID:

```bash
gcloud billing projects link bnb-marathon-pranav --billing-account=YOUR_BILLING_ID
```

Example:
```bash
gcloud billing projects link bnb-marathon-pranav --billing-account=0X1X2X-ABCDEF-123456
```

### Step 4: Run Deployment Again

Once billing is linked, run:

```bash
cd d:\election\epep
python deploy.py
```

---

## Alternative: Use Google Cloud Console Directly

If you prefer the web UI:

1. Go to https://console.cloud.google.com
2. Select project: **bnb-marathon-pranav** (top left)
3. Click "Billing" in left menu
4. Click "Link a billing account"
5. Select account with $5 credits
6. Click "Link"

Then re-run the deployment script.

---

## Project Info

- **Project ID:** bnb-marathon-pranav
- **Project Number:** 961326857165
- **Status:** Created, awaiting billing
- **Region:** asia-south1 (Mumbai)
- **Service:** epep

---

## What Happens After Linking

1. Billing account will be linked (instant)
2. APIs will automatically enable (1-2 minutes)
3. Docker build will start (1-2 minutes)
4. Cloud Run deployment (1-2 minutes)
5. Live URL will be generated

**Total time after billing link: ~5-10 minutes**

---

Contact Google Cloud Support if billing link fails.
