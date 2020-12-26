import {
  clearDatabase,
  initializeDatabase,
  insertSampleToDatabase,
} from "./database";

(async () => {
  await initializeDatabase();
  await clearDatabase();
  await insertSampleToDatabase();
})();
