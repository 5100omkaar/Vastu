@echo off
echo Deploying Fixed AI Functions...
echo.

if not exist "supabase\functions" (
    echo Error: supabase\functions directory not found
    echo Please run this script from the vastu-vision-main directory
    exit /b 1
)

echo Deploying ai-assistant function...
supabase functions deploy ai-assistant
if %errorlevel% neq 0 (
    echo Failed to deploy ai-assistant
    exit /b 1
)
echo ai-assistant deployed successfully
echo.

echo Deploying vastu-analyze function...
supabase functions deploy vastu-analyze
if %errorlevel% neq 0 (
    echo Failed to deploy vastu-analyze
    exit /b 1
)
echo vastu-analyze deployed successfully
echo.

echo All functions deployed successfully!
echo.
echo Next steps:
echo 1. Test AI Chat at http://localhost:5174
echo 2. Test Floor Plan Analysis in Dashboard
echo 3. Check logs in Supabase Dashboard
