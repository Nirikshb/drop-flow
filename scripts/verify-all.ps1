$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$failures = @()

function Run-Step($name, $dir, $command) {
  Write-Host "`n=== $name ==="
  Set-Location (Join-Path $root $dir)
  $output = Invoke-Expression $command 2>&1
  $code = $LASTEXITCODE
  $output | Select-Object -Last 12
  if ($code -ne 0) {
    Write-Host "FAILED ($code): $name"
    $script:failures += $name
  } else {
    Write-Host "PASSED: $name"
  }
}

Run-Step 'API build' 'dropflow-api' 'pnpm build'
Run-Step 'API unit tests' 'dropflow-api' 'pnpm test'
Run-Step 'API migrations' 'dropflow-api' 'pnpm migration:run'
Run-Step 'API integration smoke' 'dropflow-api' 'node test/integration-smoke.mjs'
Run-Step 'API authorization checks' 'dropflow-api' 'node test/authz-check.mjs'
Run-Step 'API security regressions' 'dropflow-api' 'node test/security-regressions.mjs'
Run-Step 'API rate limiting' 'dropflow-api' 'node test/rate-limit-check.mjs'
Run-Step 'Web typecheck' 'dropflow-web' 'pnpm typecheck'
Run-Step 'Web unit tests' 'dropflow-web' 'pnpm test'
Run-Step 'Web build' 'dropflow-web' 'pnpm build'
Run-Step 'SDK build' 'dropflow-js-sdk' 'pnpm build'
Run-Step 'SDK unit tests' 'dropflow-js-sdk' 'pnpm test'
Run-Step 'SDK built-package consumer' 'dropflow-js-sdk' 'node tests/consumer-check.mjs'
Run-Step 'React package typecheck' 'dropflow-react' 'pnpm typecheck'
Run-Step 'React package build' 'dropflow-react' 'pnpm build'

Write-Host "`n================ SUMMARY ================"
if ($failures.Count -eq 0) {
  Write-Host 'ALL VERIFICATION STEPS PASSED'
} else {
  Write-Host ('FAILED STEPS: ' + ($failures -join ', '))
  exit 1
}
