import { AppDataSource } from './data-source.js';

async function main(): Promise<void> {
  await AppDataSource.initialize();
  try {
    const revert = process.argv.includes('revert');
    if (revert) {
      await AppDataSource.undoLastMigration();
      console.log('Reverted the most recent migration.');
    } else {
      const applied = await AppDataSource.runMigrations();
      if (applied.length === 0) console.log('No pending migrations.');
      for (const migration of applied) console.log('Applied migration:', migration.name);
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
