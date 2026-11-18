$bin = 'C:\Program Files\PostgreSQL\18\bin'
$data = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\.local-db\data'))

if (-not (Test-Path (Join-Path $data 'PG_VERSION'))) {
  throw "Postgres data directory not found at $data"
}

& "$bin\pg_isready.exe" -h 127.0.0.1 -p 5434 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-Host "PostgreSQL already running on port 5434"
  exit 0
}

# A previous cluster may have been killed without a clean shutdown.
$pidFile = Join-Path $data 'postmaster.pid'
if (Test-Path $pidFile) { Remove-Item $pidFile -Force }

$proc = Start-Process -FilePath "$bin\postgres.exe" `
  -ArgumentList @('-D', "`"$data`"", '-p', '5434', '-h', '127.0.0.1') `
  -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 3
& "$bin\pg_isready.exe" -h 127.0.0.1 -p 5434
if ($LASTEXITCODE -ne 0) {
  throw "Failed to start PostgreSQL (wrapper PID $($proc.Id)). Check .local-db/postgres.log"
}
Write-Host "PostgreSQL started on 127.0.0.1:5434"
