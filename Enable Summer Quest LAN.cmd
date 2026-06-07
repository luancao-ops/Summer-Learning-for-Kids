@echo off
setlocal
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Requesting administrator permission...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo Configuring LAN access for Summer Quest...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$activeProfile = Get-NetConnectionProfile | Where-Object { $_.IPv4Connectivity -ne 'Disconnected' } | Select-Object -First 1; " ^
  "if ($activeProfile -and $activeProfile.NetworkCategory -ne 'Private') { Set-NetConnectionProfile -InterfaceIndex $activeProfile.InterfaceIndex -NetworkCategory Private }; " ^
  "if (-not (Get-NetFirewallRule -DisplayName 'Summer Quest LAN 3000' -ErrorAction SilentlyContinue)) { New-NetFirewallRule -DisplayName 'Summer Quest LAN 3000' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -Profile Private,Public | Out-Null }; " ^
  "if (-not (Get-NetFirewallRule -DisplayName 'Summer Quest LAN Ping ICMPv4' -ErrorAction SilentlyContinue)) { New-NetFirewallRule -DisplayName 'Summer Quest LAN Ping ICMPv4' -Direction Inbound -Action Allow -Protocol ICMPv4 -IcmpType 8 -Profile Private,Public | Out-Null }; " ^
  "Write-Host 'LAN access enabled.'; " ^
  "Write-Host 'Local URL: http://127.0.0.1:3000'; " ^
  "Write-Host 'LAN URL:   http://192.168.0.7:3000'"

echo.
echo Done. Restart Summer Quest if it is already running, then test from another LAN machine:
echo http://192.168.0.7:3000
echo.
pause
