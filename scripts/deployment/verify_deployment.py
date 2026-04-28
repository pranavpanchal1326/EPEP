#!/usr/bin/env python3
"""
EPEP Deployment Verification
Confirms all files are in place and ready for deployment
"""

import sys
from pathlib import Path

def verify():
    print("\n" + "="*70)
    print("EPEP → Deployment Verification")
    print("="*70)
    
    app_dir = Path("D:/election/epep")
    checks = []
    
    print("\n[Checking Files]")
    
    required_files = {
        "nginx.conf": "Web server config for Cloud Run",
        "Dockerfile": "Multi-stage Docker build",
        ".dockerignore": "Build context optimization",
        "cloudbuild.yaml": "Cloud Build CI/CD config",
        "deploy.py": "Cloud Run deployment script",
        "complete_deployment.py": "Automated billing + deployment",
        "link_billing.py": "Billing account linker",
        "package.json": "Node.js dependencies",
        ".env": "API keys configuration",
    }
    
    for filename, description in required_files.items():
        path = app_dir / filename
        exists = path.exists()
        status = "✓" if exists else "✗"
        print(f"  {status} {filename:25} ({description})")
        checks.append(exists)
    
    print("\n[Checking Build Output]")
    
    dist_dir = app_dir / "dist"
    dist_exists = dist_dir.exists()
    status = "✓" if dist_exists else "✗"
    print(f"  {status} dist/ directory created")
    checks.append(dist_exists)
    
    if dist_exists:
        dist_files = ["index.html", "manifest.webmanifest", "sw.js"]
        for file in dist_files:
            path = dist_dir / file
            exists = path.exists()
            status = "  ✓" if exists else "  ✗"
            print(f"    {status} {file}")
            checks.append(exists)
    
    print("\n[Checking Google Cloud SDK]")
    
    sdk_path = Path("C:/Temp/google-cloud-sdk")
    sdk_exists = sdk_path.exists()
    status = "✓" if sdk_exists else "✗"
    print(f"  {status} Google Cloud SDK installed")
    checks.append(sdk_exists)
    
    if sdk_exists:
        lib_path = sdk_path / "lib" / "gcloud.py"
        lib_exists = lib_path.exists()
        status = "  ✓" if lib_exists else "  ✗"
        print(f"    {status} gcloud.py module")
        checks.append(lib_exists)
    
    print("\n[Summary]")
    
    passed = sum(checks)
    total = len(checks)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"  Checks passed: {passed}/{total} ({percentage:.0f}%)")
    
    if all(checks):
        print("\n✓ ALL CHECKS PASSED!")
        print("\n🚀 Ready to deploy. Run:")
        print("   python complete_deployment.py")
        return True
    else:
        print("\n✗ Some checks failed. Please review above.")
        return False

if __name__ == "__main__":
    try:
        success = verify()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
