import { clearDatabase, initializeDatabase, insertSampleToDatabase } from ".";

(async () => {
  await initializeDatabase();
  await clearDatabase();
  await insertSampleToDatabase();
  process.exit();
})();
