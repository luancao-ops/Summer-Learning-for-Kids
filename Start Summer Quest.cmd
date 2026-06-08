@echo off
setlocal
cd /d "%~dp0"

set "RUNNING_PID="
set "RUNNING_BIND="
set "RESTART_LAN="

if /I "%~1"=="restart-lan" set "RESTART_LAN=1"

for /f "tokens=2,5" %%A in ('netstat -ano ^| findstr /r /c:"LISTENING .*:3000"') do (
  set "RUNNING_BIND=%%A"
  set "RUNNING_PID=%%B"
)

if defined RUNNING_PID if not defined RESTART_LAN (
  echo Existing process on port 3000: PID %RUNNING_PID%
  echo Current bind: %RUNNING_BIND%
  echo.

  if /I "%RUNNING_BIND%"=="127.0.0.1:3000" (
    echo The current server is local-only and blocks LAN access.
    echo Requesting administrator permission to restart it in LAN mode...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -ArgumentList 'restart-lan' -Verb RunAs"
    exit /b
  )

  echo Summer Quest is already running.
  echo Local URL: http://127.0.0.1:3000
  echo LAN URL:   http://192.168.0.7:3000
  pause
  exit /b 0
)

if defined RESTART_LAN (
  net session >nul 2>&1
  if %errorlevel% neq 0 (
    echo Administrator permission is required to restart the server in LAN mode.
    pause
    exit /b 1
  )
)

if defined RESTART_LAN (
  for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":3000 .*LISTENING"') do (
    set "RUNNING_PID=%%P"
  )
  if defined RUNNING_PID (
    taskkill /PID %RUNNING_PID% /T /F
    timeout /t 2 /nobreak >nul
  )
)

cd /d "%~dp0summer-quest"

if not exist ".next-build6\BUILD_ID" (
  echo.
  echo =====================================================
  echo  First run: building Summer Quest (about 1 minute)
  echo  This only happens once. Next time will be instant.
  echo =====================================================
  echo.
  call npm.cmd run build
  if %errorlevel% neq 0 (
    echo.
    echo BUILD FAILED. Please contact support.
    pause
    exit /b 1
  )
)

echo.
echo Starting Summer Quest...
echo Local URL: http://127.0.0.1:3000
echo LAN URL:   http://192.168.0.7:3000
echo Keep this window open while using the app.
echo.
call npm.cmd run start:lan
echo.
echo Summer Quest stopped.
pause
