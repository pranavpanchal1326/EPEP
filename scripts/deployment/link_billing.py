#!/usr/bin/env python3
"""
EPEP → Link Billing Account
Helper script to link $5 credits to the Cloud Run project
"""

import sys
import subprocess
from pathlib import Path

SDK_PATH = Path("C:/Temp/google-cloud-sdk")

def gcloud(*args):
    """Run gcloud command"""
    cmd = [sys.executable, str(SDK_PATH / "lib" / "gcloud.py")] + list(args)
    print(f"  $ gcloud {' '.join(args)}")
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0

def link_billing():
    print("\n" + "="*70)
    print("EPEP → Link Billing Account")
    print("="*70)
    
    # Get billing account ID from user
    print("\nYour $5 credits need to be linked to the project.")
    print("\nTo find your Billing Account ID:")
    print("  1. Visit: https://console.cloud.google.com/billing")
    print("  2. Look for 'My Billing Accounts'")
    print("  3. Find account with $5 credits")
    print("  4. Copy the Billing Account ID (format: 0X1X2X-XXXXXX-XXXXXX)")
    
    billing_id = input("\nEnter your Billing Account ID: ").strip()
    
    if not billing_id:
        print("\n✗ Cancelled")
        return False
    
    print(f"\nLinking billing account: {billing_id}")
    print("Project: bnb-marathon-pranav\n")
    
    # Link billing
    if not gcloud("billing", "projects", "link", "bnb-marathon-pranav", 
                  "--billing-account", billing_id):
        print("\n✗ Failed to link billing account")
        print("\nTroubleshooting:")
        print("  - Verify Billing Account ID is correct")
        print("  - Ensure you're logged in: gcloud auth list")
        print("  - Visit: https://console.cloud.google.com/billing")
        return False
    
    print("\n✓ Billing account linked successfully!")
    print("\nNext steps:")
    print("  1. Wait 30 seconds for billing to activate")
    print("  2. Run deployment again:")
    print("     python deploy.py")
    
    return True

if __name__ == "__main__":
    try:
        success = link_billing()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
