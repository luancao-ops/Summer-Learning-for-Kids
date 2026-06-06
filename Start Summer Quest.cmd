@echo off
setlocal
cd /d "%~dp0"

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":3000 .*LISTENING"') do (
  set "RUNNING_PID=%%P"
)

if defined RUNNING_PID (
  echo Summer Quest is already running on http://127.0.0.1:3000
  echo Existing PID: %RUNNING_PID%
  pause
  exit /b 0
)

cd /d "%~dp0summer-quest"
if exist ".next\dev" rd /s /q ".next\dev"
if exist ".next\build-manifest.json" del /f /q ".next\build-manifest.json"
if exist ".next\app-path-routes-manifest.json" del /f /q ".next\app-path-routes-manifest.json"
echo Starting Summer Quest at http://127.0.0.1:3000
echo Keep this window open while using the app.
call npm.cmd run dev:local
echo.
echo Summer Quest stopped or failed to start.
pause
