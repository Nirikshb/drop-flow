$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))

# Stop any stale API and any stale dev-database listeners from prior sessions.
foreach ($port in 3001, 5434) {
  $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($listener in $listeners) {
    Write-Host "Stopping stale PID $($listener.OwningProcess) on port $port"
    Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Seconds 1

& (Join-Path $PSScriptRoot 'start-local-db.ps1')
Set-Location (Join-Path $root 'dropflow-api')
pnpm migration:run
pnpm start
