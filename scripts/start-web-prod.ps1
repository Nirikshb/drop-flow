$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
foreach ($listener in $listeners) {
  Write-Host "Stopping stale web PID $($listener.OwningProcess)"
  Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
}
Set-Location (Join-Path $root 'dropflow-web')
pnpm build
pnpm start
