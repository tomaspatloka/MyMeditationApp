@echo off
echo ========================================
echo   Meditacni PWA - Lokalni server
echo ========================================
echo.
echo Spoustim server na http://localhost:8000
echo.
echo Pro zastaveni stisknete Ctrl+C
echo.
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
