@echo off
setlocal
cd /d "%~dp0"

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
echo Stopped Summer Quest process PID %FOUND_PID%.

pause
