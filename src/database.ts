import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Database } from "./types/interfaces";

// Generate Database
const adapter = new FileSync("db.json");
const db = low(adapter);

const database: Database = {
  users: [
    {
      email: "admin@monet.com", // primary key
      name: "admin",
      phone: "010-1234-5678",
      password: "secret",
      level: 200,
    },
    {
      email: "research@monet.com",
      name: "researcher",
      phone: "010-8765-4321",
      password: "secret",
      level: 100,
    },
    {
      email: "subject@monet.com", // primary key
      name: "subject",
      phone: "010-1234-5678",
      password: "secret",
      level: 0,
    },
  ],
  projects: [
    {
      id: "project1",
      name: "Project 1",
      owner: "admin@monet.com",
      coverFileId: "",
      experiments: [
        {
          id: "experiment1",
          description: "Experiment 1",
          coverFileId: "",
          instructionsJson: "",
        },
      ],
    },
  ],
  participations: [
    {
      experimentId: "experiment1",
      participantEmail: "admin@monet.com",
      timestamp: 1608710095359,
      resultJson: "{}", // in json
    },
  ],
};

export function initializeDatabase() {
  db.defaults(database).write();
}

export default db;
