# Migrations

TypeORM migrations live here. The database connection in `database.module.ts`
points at the compiled `dist/database/migrations/*.js` files and does **not**
run them automatically (`migrationsRun: false`). Migrations are applied by an
explicit operator command after review. Phase 2 introduces the first schema
migration.

To generate a migration (once entities exist):

```bash
pnpm typeorm migration:generate -d src/data-source.ts src/database/migrations/Name
```

To apply reviewed migrations:

```bash
pnpm migration:run
```
