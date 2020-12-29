import { clearDatabase, initializeDatabase, insertSampleToDatabase } from ".";
import fs from "fs"

(async () => {
  await initializeDatabase();
  await clearDatabase();
  await insertSampleToDatabase();
  process.exit();
})();
