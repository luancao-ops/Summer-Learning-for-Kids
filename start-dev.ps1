Set-Location -LiteralPath "$PSScriptRoot\summer-quest"
Write-Host "Starting Summer Quest at http://127.0.0.1:3000"
Write-Host "Keep this window open while using the app."
& npm.cmd run dev:local
