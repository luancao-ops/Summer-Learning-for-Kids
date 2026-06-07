@echo off
setlocal
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Requesting administrator permission...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

set "FOUND_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":3000 .*LISTENING"') do (
  set "FOUND_PID=%%P"
)

if not defined FOUND_PID (
  echo Summer Quest is not running on port 3000.
  pause
  exit /b 0
)

taskkill /PID %FOUND_PID% /T /F
if %errorlevel% neq 0 (
  echo Could not stop PID %FOUND_PID%.
  pause
  exit /b 1
)

echo Stopped Summer Quest process PID %FOUND_PID%.
pause
