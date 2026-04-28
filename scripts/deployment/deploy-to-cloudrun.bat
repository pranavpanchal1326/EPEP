@echo off
REM ════════════════════════════════════════════════════════════════
REM EPEP → Google Cloud Run Auto-Deployment Script
REM ════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_ID=bnb-marathon-pranav
set SERVICE_NAME=epep
set REGION=asia-south1
set IMAGE_NAME=%REGION%-docker.pkg.dev/%PROJECT_ID%/epep-repo/%SERVICE_NAME%
set EMAIL=pranavpanchal1326@gmail.com
set GCLOUD_DIR=%USERPROFILE%\.gcloud

echo.
echo ════════════════════════════════════════════════════════════════
echo EPEP → Google Cloud Run Deployment
echo ════════════════════════════════════════════════════════════════
echo.
echo Project:     %PROJECT_ID%
echo Service:     %SERVICE_NAME%
echo Region:      %REGION%
echo Email:       %EMAIL%
echo.

REM Step 1: Try to find gcloud installation
echo [1/5] Checking for Google Cloud SDK...
where gcloud >nul 2>&1
if !errorlevel! neq 0 (
    echo ⚠️  gcloud not found in PATH
    echo.
    echo Please complete the Google Cloud SDK installation manually:
    echo.
    echo 1. Open C:\Temp\GoogleCloudSDKInstaller.exe (double-click)
    echo 2. Follow the installer wizard
    echo 3. When prompted, sign in with: %EMAIL%
    echo 4. After installation, close and reopen this terminal
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✓ Google Cloud SDK found
gcloud --version
echo.

REM Step 2: Authenticate
echo [2/5] Authenticating with Google Cloud...
call gcloud auth login --quiet
if !errorlevel! neq 0 (
    echo ✗ Authentication failed
    exit /b 1
)
echo ✓ Authenticated
echo.

REM Step 3: Create/Configure Project
echo [3/5] Setting up Google Cloud Project...
gcloud config set project %PROJECT_ID%
gcloud projects create %PROJECT_ID% --name="EPEP PromptWars 2026" 2>nul
if !errorlevel! equ 0 (
    echo ✓ Project created
) else (
    echo ✓ Project already exists
)

REM Enable required APIs
echo   Enabling APIs...
call gcloud services enable ^
  run.googleapis.com ^
  containerregistry.googleapis.com ^
  artifactregistry.googleapis.com ^
  cloudbuild.googleapis.com
echo ✓ APIs enabled
echo.

REM Step 4: Deploy to Cloud Run via Cloud Build
echo [4/5] Deploying to Cloud Run...
echo   This may take 3-5 minutes...
echo.

cd /d D:\election\epep

call gcloud run deploy %SERVICE_NAME% ^
  --source . ^
  --region=%REGION% ^
  --platform=managed ^
  --allow-unauthenticated ^
  --port=8080 ^
  --memory=256Mi ^
  --cpu=1 ^
  --min-instances=0 ^
  --max-instances=3 ^
  --timeout=30 ^
  --description="EPEP - Election Process Education Platform"

if !errorlevel! neq 0 (
    echo ✗ Deployment failed
    exit /b 1
)
echo ✓ Deployment successful
echo.

REM Step 5: Get Service URL
echo [5/5] Retrieving service URL...
for /f "tokens=*" %%A in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)" 2^>nul') do set SERVICE_URL=%%A

if "!SERVICE_URL!"=="" (
    echo ✗ Could not retrieve service URL
    exit /b 1
)

echo ✓ Service URL: !SERVICE_URL!
echo.

REM Test the service
echo ════════════════════════════════════════════════════════════════
echo Testing deployment...
echo ════════════════════════════════════════════════════════════════
echo.

echo Testing homepage...
curl -I !SERVICE_URL!/
echo.
echo Testing /map route...
curl -I !SERVICE_URL!/map
echo.
echo Testing /quiz route...
curl -I !SERVICE_URL!/quiz
echo.

echo ════════════════════════════════════════════════════════════════
echo ✓ DEPLOYMENT COMPLETE!
echo ════════════════════════════════════════════════════════════════
echo.
echo 🚀 Your app is live at:
echo    !SERVICE_URL!
echo.
echo 📋 Next steps:
echo.
echo 1. Open in browser:
echo    !SERVICE_URL!
echo.
echo 2. Test all routes:
echo    - Homepage
echo    - /map - Electoral Map
echo    - /quiz - Quiz
echo    - /evm - EVM Simulator
echo    - /learn - Education Hub
echo.
echo 3. Update README.md with:
echo    [![Deploy Status](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](%%SERVICE_URL%%)
echo.
echo 4. Optional: Set up custom domain or Cloud Build CI/CD
echo.
echo 💰 Budget: $5.00 (Estimated cost: $0.02)
echo.
echo ════════════════════════════════════════════════════════════════

REM Save URL to file for reference
echo !SERVICE_URL! > "%USERPROFILE%\Desktop\EPEP_CLOUD_RUN_URL.txt"
echo URL saved to Desktop\EPEP_CLOUD_RUN_URL.txt
echo.

pause
