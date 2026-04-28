#!/usr/bin/env python3
"""
EPEP -> Complete Deployment Automation
This script handles billing link AND full deployment in one go.
User just needs to provide billing account ID.
"""

import sys
import subprocess
import time
from pathlib import Path

SDK_PATH = Path("C:/Temp/google-cloud-sdk")
PROJECT_ID = "bnb-marathon-pranav"
SERVICE_NAME = "epep"
REGION = "asia-south1"
APP_DIR = Path("D:/election/epep")

def gcloud(*args, silent=False):
    """Run gcloud command"""
    cmd = [sys.executable, str(SDK_PATH / "lib" / "gcloud.py")] + list(args)
    
    if not silent:
        print(f"  $ gcloud {' '.join(args)}")
    
    result = subprocess.run(cmd, capture_output=silent, text=True)
    
    if not silent and result.returncode != 0 and result.stderr:
        print(f"  Error: {result.stderr[:200]}")
    
    return result

def main():
    print("\n" + "="*70)
    print("EPEP -> Complete Cloud Run Deployment")
    print("="*70)
    
    # Step 1: Get billing account ID
    print("\n[STEP 1] Getting Billing Account ID...")
    print("\n  To find your Billing Account ID:")
    print("    1. Visit: https://console.cloud.google.com/billing")
    print("    2. Click 'My Billing Accounts'")
    print("    3. Find account with $5 credits")
    print("    4. Copy the Billing Account ID (e.g., 0X1X2X-XXXXXX-XXXXXX)")
    
    billing_id = input("\n  Enter Billing Account ID: ").strip()
    
    if not billing_id:
        print("\n  [FAIL] No billing account ID provided. Exiting.")
        return False
    
    # Step 2: Link billing
    print("\n[STEP 2] Linking Billing Account...")
    print(f"  Project: {PROJECT_ID}")
    print(f"  Billing: {billing_id}\n")
    
    result = gcloud("billing", "projects", "link", PROJECT_ID, 
                   "--billing-account", billing_id)
    
    if result.returncode != 0:
        print(f"\n  [FAIL] Failed to link billing account")
        print(f"     {result.stderr[:300]}")
        return False
    
    print("  [OK] Billing linked!")
    
    # Step 3: Wait for billing to activate
    print("\n[STEP 3] Waiting for billing activation...")
    for i in range(3, 0, -1):
        print(f"  {i}...", end=" ", flush=True)
        time.sleep(1)
    print("[OK]")
    
    # Step 4: Deploy
    print("\n[STEP 4] Deploying to Cloud Run...")
    print("  This will take 5-10 minutes. Please wait...\n")
    
    os.chdir(APP_DIR)
    
    result = gcloud(
        "run", "deploy", SERVICE_NAME,
        "--source", ".",
        "--region", REGION,
        "--platform", "managed",
        "--allow-unauthenticated",
        "--port", "8080",
        "--memory", "256Mi",
        "--cpu", "1",
        "--min-instances", "0",
        "--max-instances", "3",
        "--timeout", "30",
        "--description", "EPEP - Election Process Education Platform"
    )
    
    if result.returncode != 0:
        print("\n  [FAIL] Deployment failed")
        return False
    
    # Step 5: Get URL
    print("\n[STEP 5] Retrieving Service URL...")
    
    result = gcloud(
        "run", "services", "describe", SERVICE_NAME,
        "--region", REGION, "--format", "value(status.url)",
        silent=True
    )
    
    if result.returncode != 0:
        print("  [FAIL] Could not retrieve URL")
        return False
    
    url = result.stdout.strip()
    
    # Success!
    print("\n" + "="*70)
    print("[OK] DEPLOYMENT COMPLETE!")
    print("="*70)
    print(f"\n🚀 LIVE URL:\n   {url}")
    print("\n📋 Next Steps:")
    print(f"   1. Visit in browser: {url}")
    print("   2. Test all pages: /map, /quiz, /evm, /learn")
    print("   3. Test SPA routing (refresh any page)")
    print("   4. Update README.md with URL:")
    print(f"      [![](https://img.shields.io/badge/Live-{url.split('/')[-1]}-4285F4)]({url})")
    print("\n💰 Budget: $5.00 | Estimated cost: $0.02")
    print("="*70 + "\n")
    
    # Save URL
    try:
        desktop = Path.home() / "Desktop"
        url_file = desktop / "EPEP_CLOUD_RUN_URL.txt"
        url_file.write_text(url)
        print(f"[OK] URL saved to: {url_file}\n")
    except:
        pass
    
    return True

if __name__ == "__main__":
    import os
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n[FAIL] Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
