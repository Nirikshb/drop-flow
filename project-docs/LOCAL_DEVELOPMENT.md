# Local Development

## Prerequisites (verified 2026-11-18)

| Tool | Required | Installed |
|---|---|---|
| Node.js | ≥ 20.9 (Next 16), ≥ 20 (Nest 12) | v24.13.0 |
| pnpm | 10.x | 10.14.0 |
| Git | any recent | 2.38.0 |
| PostgreSQL | 14+ | 18.6 |

## Local database

The system PostgreSQL service on port 5432 uses SCRAM auth and no working credentials were available. An isolated dev cluster was created instead:

```text
host:     127.0.0.1
port:     5434
role:     dropflow / dropflow_dev_2026
databases: dropflow_dev, dropflow_test
data dir: dropflow/.local-db/data   (gitignored)
```

Start it after a reboot:

```powershell
$bin = 'C:\Program Files\PostgreSQL\18\bin'
$data = 'C:\Users\ASUS\Downloads\Projects\dropflow\.local-db\data'
Start-Process -FilePath "$bin\postgres.exe" `
  -ArgumentList @('-D', "`"$data`"", '-p', '5434', '-h', '127.0.0.1') -WindowStyle Hidden
```

Stop it with `& "$bin\pg_ctl.exe" -D $data stop`.

## First-time install

```powershell
cd dropflow/dropflow-web
pnpm install

cd ../dropflow-api
pnpm install

cd ../dropflow-js-sdk
pnpm install
```

## Run

```powershell
# Terminal 1
cd dropflow/dropflow-api && pnpm start:dev     # http://127.0.0.1:3001

# Terminal 2
cd dropflow/dropflow-web && pnpm dev            # http://127.0.0.1:3000

# Terminal 3 (only when building/testing the SDK)
cd dropflow/dropflow-js-sdk && pnpm dev
```

## Verification commands

```powershell
# API health (includes a real PostgreSQL ping)
curl http://127.0.0.1:3001/health

# API unit tests
cd dropflow-api && pnpm test

# SDK build + tests
cd dropflow-js-sdk && pnpm build && pnpm test

# Web build + tests + lint
cd dropflow-web && pnpm build && pnpm test && pnpm lint
```
