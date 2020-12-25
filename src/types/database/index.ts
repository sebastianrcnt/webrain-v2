import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Database } from "../interfaces";

// Generate Database
const adapter = new FileSync("db.json");
const db: any = low(adapter);

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
      description: "this is project 1",
      agreement: "do you agree?",
      projectGroupId: "projectgroup1",
      coverFileId: "p1cov.webp",
    },
  ],
  experiments: [
    {
      id: "experiment1",
      name: "Experiment 1",
      description: "This is Experiment 1",
      projectId: "project1",
      coverFileId: "e1.webp",
      instructionsJson: "",
    },
    {
      id: "experiment2",
      name: "Experiment 2",
      description: "This is Experiment 2",
      projectId: "project1",
      coverFileId: "e2.webp",
      instructionsJson: "",
    },
    {
      id: "experiment3",
      name: "Experiment 3",
      description: "This is Experiment 3",
      projectId: "project1",
      coverFileId: "e3.webp",
      instructionsJson: "",
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
  projectGroups: [
    {
      id: "projectgroup1",
      name: "Project Group 1",
      description: "this is project group 1",
      coverFileId: "up1cov.webp",
    },
  ],
};

export function initializeDatabase() {
  db.defaults(database).write();
}

export default db;
