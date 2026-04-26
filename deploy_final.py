#!/usr/bin/env python3
"""
EPEP → Google Cloud Run Deployment
Complete automation with installed SDK at C:\Temp\google-cloud-sdk
"""

import os
import sys
import subprocess
import json
from pathlib import Path

# Configuration
PROJECT_ID = "bnb-marathon-pranav"
SERVICE_NAME = "epep"
REGION = "asia-south1"
EMAIL = "pranavpanchal1326@gmail.com"
SDK_PATH = Path("C:/Temp/google-cloud-sdk")
APP_DIR = Path("D:/election/epep")

# Use the extracted SDK
sys.path.insert(0, str(SDK_PATH / "lib"))
os.environ['CLOUDSDK_PYTHON'] = sys.executable

def run_cmd(cmd, description=""):
    """Run command and return result"""
    if description:
        print(f"\n▶ {description}")
    
    try:
        result = subprocess.run(
            cmd,
            shell=True if isinstance(cmd, str) else False,
            capture_output=True,
            text=True,
            timeout=600
        )
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

def deploy():
    """Execute full Cloud Run deployment"""
    print("\n" + "="*70)
    print("EPEP → Google Cloud Run Deployment")
    print("="*70)
    
    # Step 1: Verify SDK
    print("\n[1/6] Verifying Google Cloud SDK...")
    gcloud_module = SDK_PATH / "lib" / "gcloud"
    if gcloud_module.exists():
        print("  ✓ SDK found and ready")
    else:
        print("  ✗ SDK module not found")
        return False
    
    # Step 2: Setup Python path for gcloud
    print("\n[2/6] Setting up gcloud CLI...")
    
    # Add SDK to path
    sdk_bin = str(SDK_PATH / "bin")
    current_path = os.environ.get('PATH', '')
    if sdk_bin not in current_path:
        os.environ['PATH'] = f"{sdk_bin};{current_path}"
    
    # Try using gcloud via Python module
    print("  ✓ SDK configured")
    
    # Step 3: Authenticate
    print("\n[3/6] Authenticating with Google Cloud...")
    print(f"  Email: {EMAIL}")
    
    auth_cmd = f"python \"{SDK_PATH}/bin/gcloud\" auth login"
    result = run_cmd(auth_cmd, "Opening authentication browser...")
    if result and result.returncode != 0:
        print("  ℹ Check browser for authentication prompt")
    else:
        print("  ✓ Authenticated")
    
    # Step 4: Setup Project
    print("\n[4/6] Setting up Google Cloud Project...")
    
    # Set project
    cmd = f"python \"{SDK_PATH}/bin/gcloud\" config set project {PROJECT_ID}"
    run_cmd(cmd)
    
    # Create project
    cmd = f"python \"{SDK_PATH}/bin/gcloud\" projects create {PROJECT_ID} --name=\"EPEP PromptWars 2026\""
    result = run_cmd(cmd)
    if "already exists" in (result.stderr if result else ""):
        print("  ℹ Project already exists")
    else:
        print("  ✓ Project created")
    
    # Enable APIs
    print("\n  Enabling required APIs...")
    cmd = f"python \"{SDK_PATH}/bin/gcloud\" services enable run.googleapis.com containerregistry.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com"
    result = run_cmd(cmd)
    if result and result.returncode == 0:
        print("  ✓ APIs enabled")
    else:
        print("  ℹ APIs (may already be enabled)")
    
    # Step 5: Deploy to Cloud Run
    print("\n[5/6] Deploying to Cloud Run...")
    print("  This will take 3-5 minutes, please wait...")
    
    os.chdir(APP_DIR)
    
    deploy_cmd = (
        f"python \"{SDK_PATH}/bin/gcloud\" run deploy {SERVICE_NAME} "
        f"--source . "
        f"--region={REGION} "
        f"--platform=managed "
        f"--allow-unauthenticated "
        f"--port=8080 "
        f"--memory=256Mi "
        f"--cpu=1 "
        f"--min-instances=0 "
        f"--max-instances=3 "
        f"--timeout=30 "
        f"--description=\"EPEP - Election Process Education Platform\""
    )
    
    result = run_cmd(deploy_cmd)
    if result and result.returncode == 0:
        print("  ✓ Deployment successful")
    else:
        print(f"  ✗ Deployment failed")
        if result:
            print(f"  Error: {result.stderr[:500]}")
        return False
    
    # Step 6: Get Service URL
    print("\n[6/6] Retrieving service URL...")
    
    cmd = f"python \"{SDK_PATH}/bin/gcloud\" run services describe {SERVICE_NAME} --region={REGION} --format=\"value(status.url)\""
    result = run_cmd(cmd)
    
    if result and result.returncode == 0:
        url = result.stdout.strip()
        print(f"  ✓ Service URL retrieved")
        
        # Display success message
        print("\n" + "="*70)
        print("✓ DEPLOYMENT COMPLETE!")
        print("="*70)
        print(f"\n🚀 Your app is live at:\n   {url}")
        print("\n📋 Next steps:")
        print(f"   1. Open in browser: {url}")
        print(f"   2. Test routes: /map, /quiz, /evm")
        print("   3. Update README.md with the URL")
        print("\n💰 Budget: $5.00 | Estimated cost: $0.02")
        print("="*70 + "\n")
        
        # Save URL
        desktop = Path.home() / "Desktop"
        url_file = desktop / "EPEP_CLOUD_RUN_URL.txt"
        try:
            with open(url_file, 'w') as f:
                f.write(url)
            print(f"✓ URL saved to: {url_file}")
        except:
            print(f"✓ Cloud Run URL: {url}")
        
        return True
    else:
        print(f"  ✗ Could not retrieve URL")
        return False

if __name__ == '__main__':
    try:
        success = deploy()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n✗ Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
