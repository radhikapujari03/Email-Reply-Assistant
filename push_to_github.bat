@echo off
TITLE Push to GitHub
cd /d "%~dp0"
echo ========================================================
echo    Pushing Email Reply Assistant to GitHub...
echo    Target: https://github.com/radhikapujari03/Email-Reply-Assistant
echo ========================================================
git push -u origin main
echo.
pause
