#!/usr/bin/env python3
"""
EPEP -> Google Cloud Run Direct Deployment
Using gcloud Python entry point from SDK
"""

import os
import sys
import subprocess
from pathlib import Path

# Configuration
PROJECT_ID = "bnb-marathon-pranav"
SERVICE_NAME = "epep"
REGION = "asia-south1"
EMAIL = "pranavpanchal1326@gmail.com"
SDK_PATH = Path("C:/Temp/google-cloud-sdk")
APP_DIR = Path("D:/election/epep")

def gcloud(*args):
    """Call gcloud with arguments"""
    cmd = [sys.executable, str(SDK_PATH / "lib" / "gcloud.py")] + list(args)
    
    print(f"  $ gcloud {' '.join(args)}")
    result = subprocess.run(cmd, capture_output=False, text=True)
    return result.returncode == 0

def main():
    print("\n" + "="*70)
    print("EPEP -> Google Cloud Run Deployment")
    print("="*70)
    
    # Verify SDK
    print("\n[1/6] Verifying Google Cloud SDK...")
    sdk_lib = SDK_PATH / "lib" / "gcloud.py"
    if sdk_lib.exists():
        print(f"  [OK] SDK found: {sdk_lib}")
    else:
        print(f"  [FAIL] SDK not found at {sdk_lib}")
        return False
    
    # Set project
    print("\n[2/6] Setting up Google Cloud Project...")
    os.chdir(APP_DIR)
    
    if not gcloud("config", "set", "project", PROJECT_ID):
        return False
    print("  [OK] Project configured")
    
    # Create project
    print("  Creating project (or using existing)...")
    gcloud("projects", "create", PROJECT_ID, "--name=EPEP PromptWars 2026")
    print("  [OK] Project ready")
    
    # Enable APIs
    print("\n[3/6] Enabling required APIs...")
    apis = [
        "run.googleapis.com",
        "containerregistry.googleapis.com",
        "artifactregistry.googleapis.com",
        "cloudbuild.googleapis.com"
    ]
    
    if not gcloud("services", "enable", *apis):
        print("  ℹ APIs (may already be enabled)")
    else:
        print("  [OK] APIs enabled")
    
    # Authenticate (if needed)
    print("\n[4/6] Checking authentication...")
    result = subprocess.run(
        [sys.executable, str(SDK_PATH / "lib" / "gcloud.py"), "auth", "list"],
        capture_output=True,
        text=True
    )
    
    if "ACTIVE" not in result.stdout:
        print("  Authenticating...")
        gcloud("auth", "login")
        print(f"  [OK] Sign in with: {EMAIL}")
    else:
        print("  [OK] Already authenticated")
    
    # Deploy
    print("\n[5/6] Deploying to Cloud Run...")
    print("  This will take 3-5 minutes...\n")
    
    deploy_args = [
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
    ]
    
    if not gcloud(*deploy_args):
        print("\n  [FAIL] Deployment failed")
        return False
    
    print("\n  [OK] Deployment successful")
    
    # Get URL
    print("\n[6/6] Retrieving service URL...")
    result = subprocess.run(
        [sys.executable, str(SDK_PATH / "lib" / "gcloud.py"),
         "run", "services", "describe", SERVICE_NAME,
         "--region", REGION, "--format", "value(status.url)"],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        url = result.stdout.strip()
        
        print("\n" + "="*70)
        print("[OK] DEPLOYMENT COMPLETE!")
        print("="*70)
        print(f"\nGO Live URL:\n   {url}")
        print("\nINFO Next:")
        print(f"   1. Visit: {url}")
        print("   2. Test /map, /quiz, /evm routes")
        print("   3. Update README with URL")
        print("\nBUDGET Budget: $5.00 | Estimated: $0.02")
        print("="*70 + "\n")
        
        # Save URL
        try:
            desktop = Path.home() / "Desktop"
            (desktop / "EPEP_CLOUD_RUN_URL.txt").write_text(url)
            print(f"[OK] URL saved to Desktop/EPEP_CLOUD_RUN_URL.txt\n")
        except:
            pass
        
        return True
    else:
        print(f"  [FAIL] Could not retrieve URL: {result.stderr[:200]}")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n[FAIL] Cancelled")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
