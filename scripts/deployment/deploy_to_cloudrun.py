#!/usr/bin/env python3
"""
EPEP → Google Cloud Run Deployment Script
Automates deployment to Cloud Run without requiring manual gcloud installation
"""

import os
import subprocess
import json
import sys
import time
from pathlib import Path

class EPEPDeployer:
    def __init__(self):
        self.project_id = "bnb-marathon-pranav"
        self.service_name = "epep"
        self.region = "asia-south1"
        self.email = "pranavpanchal1326@gmail.com"
        self.app_dir = Path("D:/election/epep")
        self.gcloud_cmd = self._find_gcloud()
        
    def _find_gcloud(self):
        """Find gcloud executable in PATH or common locations"""
        # Try PATH first
        result = subprocess.run(['where', 'gcloud'], capture_output=True)
        if result.returncode == 0:
            return 'gcloud'
        
        # Common installation paths
        paths = [
            r"C:\Program Files (x86)\Google\Cloud SDK\bin\gcloud.cmd",
            r"C:\Program Files\Google\Cloud SDK\bin\gcloud.cmd",
            r"C:\gcloud\bin\gcloud.cmd",
        ]
        
        for path in paths:
            if os.path.exists(path):
                return path
        
        return None
    
    def _run_command(self, cmd, description=""):
        """Run command and handle errors"""
        if description:
            print(f"\n▶ {description}")
        
        print(f"  Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
        
        try:
            result = subprocess.run(
                cmd if isinstance(cmd, list) else cmd,
                shell=isinstance(cmd, str),
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                print(f"  ✗ Error: {result.stderr}")
                return False
            
            print(f"  ✓ Success")
            if result.stdout:
                print(f"  Output: {result.stdout[:200]}")
            
            return True
        except Exception as e:
            print(f"  ✗ Exception: {e}")
            return False
    
    def check_setup(self):
        """Check if gcloud is installed"""
        print("\n" + "="*70)
        print("EPEP → Google Cloud Run Deployment")
        print("="*70)
        
        print("\n[1/6] Checking prerequisites...")
        
        if not self.gcloud_cmd:
            print("\n  ✗ Google Cloud SDK not found!")
            print("\n  Please install from: https://cloud.google.com/sdk/docs/install")
            print("  Or run the installer at: C:\\Temp\\GoogleCloudSDKInstaller.exe")
            return False
        
        print(f"  ✓ gcloud found: {self.gcloud_cmd}")
        return True
    
    def authenticate(self):
        """Authenticate with Google Cloud"""
        print("\n[2/6] Authenticating with Google Cloud...")
        print(f"  Using email: {self.email}")
        
        if not self._run_command([self.gcloud_cmd, 'auth', 'login'], 
                                "Opening browser for authentication"):
            print("\n  Authentication required. A browser window should have opened.")
            print(f"  Sign in with: {self.email}")
            time.sleep(5)
        
        # Verify authentication
        result = subprocess.run(
            [self.gcloud_cmd, 'auth', 'list'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("  ✓ Authenticated successfully")
            return True
        else:
            print("  ✗ Authentication failed")
            return False
    
    def setup_project(self):
        """Create GCP project and enable APIs"""
        print("\n[3/6] Setting up Google Cloud Project...")
        
        # Set project
        self._run_command(
            [self.gcloud_cmd, 'config', 'set', 'project', self.project_id],
            "Setting active project"
        )
        
        # Try to create project (may already exist)
        print("\n  Creating project (may already exist)...")
        result = subprocess.run(
            [self.gcloud_cmd, 'projects', 'create', self.project_id,
             '--name', 'EPEP PromptWars 2026'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("  ✓ Project created")
            time.sleep(5)  # Wait for project to initialize
        else:
            print("  ℹ Project already exists")
        
        # Enable APIs
        print("\n  Enabling required APIs...")
        apis = [
            'run.googleapis.com',
            'containerregistry.googleapis.com',
            'artifactregistry.googleapis.com',
            'cloudbuild.googleapis.com'
        ]
        
        self._run_command(
            [self.gcloud_cmd, 'services', 'enable'] + apis,
            "Enabling Cloud Run, Artifact Registry, Cloud Build"
        )
        
        return True
    
    def deploy(self):
        """Deploy to Cloud Run"""
        print("\n[4/6] Deploying to Cloud Run...")
        print("  This may take 3-5 minutes. Please wait...")
        
        os.chdir(self.app_dir)
        
        cmd = [
            self.gcloud_cmd, 'run', 'deploy', self.service_name,
            '--source', '.',
            '--region', self.region,
            '--platform', 'managed',
            '--allow-unauthenticated',
            '--port', '8080',
            '--memory', '256Mi',
            '--cpu', '1',
            '--min-instances', '0',
            '--max-instances', '3',
            '--timeout', '30',
            '--description', 'EPEP - Election Process Education Platform'
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=False,
            text=True
        )
        
        return result.returncode == 0
    
    def get_service_url(self):
        """Retrieve the deployed service URL"""
        print("\n[5/6] Retrieving service URL...")
        
        result = subprocess.run(
            [self.gcloud_cmd, 'run', 'services', 'describe', self.service_name,
             '--region', self.region, '--format', 'value(status.url)'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            url = result.stdout.strip()
            print(f"  ✓ Service URL: {url}")
            return url
        else:
            print("  ✗ Could not retrieve service URL")
            return None
    
    def test_deployment(self, url):
        """Test the deployed service"""
        print("\n[6/6] Testing deployment...")
        
        routes = ['/', '/map', '/quiz', '/evm']
        
        for route in routes:
            test_url = f"{url}{route}"
            print(f"\n  Testing {route}...")
            result = subprocess.run(
                ['curl', '-I', test_url],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if 'HTTP' in result.stdout:
                status = result.stdout.split('\n')[0]
                print(f"    {status}")
            else:
                print(f"    ? Could not test (curl may not be configured)")
        
        return True
    
    def run(self):
        """Execute full deployment"""
        try:
            if not self.check_setup():
                return False
            
            if not self.authenticate():
                return False
            
            if not self.setup_project():
                return False
            
            if not self.deploy():
                print("\n✗ Deployment failed")
                return False
            
            service_url = self.get_service_url()
            if not service_url:
                return False
            
            self.test_deployment(service_url)
            
            # Display summary
            print("\n" + "="*70)
            print("✓ DEPLOYMENT COMPLETE!")
            print("="*70)
            print(f"\n🚀 Your app is live at:\n   {service_url}")
            print("\n📋 Next steps:")
            print("   1. Open in browser and test all routes")
            print("   2. Update README.md with the URL")
            print("   3. Monitor costs in Google Cloud Console")
            print("\n💰 Budget: $5.00 (Estimated cost: $0.02)")
            print("="*70 + "\n")
            
            # Save URL
            with open(os.path.expanduser("~/Desktop/EPEP_CLOUD_RUN_URL.txt"), 'w') as f:
                f.write(service_url)
            print("✓ URL saved to Desktop/EPEP_CLOUD_RUN_URL.txt")
            
            return True
            
        except KeyboardInterrupt:
            print("\n\n✗ Deployment cancelled by user")
            return False
        except Exception as e:
            print(f"\n✗ Unexpected error: {e}")
            return False

if __name__ == '__main__':
    deployer = EPEPDeployer()
    success = deployer.run()
    sys.exit(0 if success else 1)
