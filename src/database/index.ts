import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Database, ModelName } from "../types/interfaces/models";

// Generate Database
const adapter = new FileSync("database.json");
const db: any = low(adapter);

const database: Database = {
  User: [
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
  Project: [
    {
      id: "project1",
      name: "Project 1",
      author: {
        model: ModelName.USER,
        foreginKey: "email",
        primaryKey: "admin@monet.com",
      },
      description: "this is project 1",
      agreement: "do you agree?",
      projectGroup: {
        model: ModelName.PROJECT_GROUP,
        foreginKey: "id",
        primaryKey: "projectgroup1",
      },
      coverFileId: "p1cov.webp",
    },
    {
      id: "project2",
      name: "Project 2",
      author: {
        model: ModelName.USER,
        foreginKey: "email",
        primaryKey: "admin@monet.com",
      },
      description: "this is project 2",
      agreement: "do you agree?",
      projectGroup: {
        model: ModelName.PROJECT_GROUP,
        foreginKey: "id",
        primaryKey: "projectgroup1",
      },
      coverFileId: "p1cov.webp",
    },
  ],
  Experiment: [
    {
      id: "experiment1",
      name: "Experiment 1",
      description: "This is Experiment 1",
      coverFileId: "e1.webp",
      instructionsJson: "",
      project: {
        model: ModelName.PROJECT,
        foreginKey: "id",
        primaryKey: "project1",
      },
    },
    {
      id: "experiment2",
      name: "Experiment 2",
      description: "This is Experiment 2",
      coverFileId: "e2.webp",
      instructionsJson: "",
      project: {
        model: ModelName.PROJECT,
        foreginKey: "id",
        primaryKey: "project1",
      },
    },
    {
      id: "experiment3",
      name: "Experiment 3",
      description: "This is Experiment 3",
      coverFileId: "e3.webp",
      instructionsJson: "",
      project: {
        model: ModelName.PROJECT,
        foreginKey: "id",
        primaryKey: "project1",
      },
    },
  ],
  Participation: [
    {
      experiment: {
        model: ModelName.EXPERIMENT,
        foreginKey: "id",
        primaryKey: "experiment1",
      },
      participant: {
        model: ModelName.USER,
        foreginKey: "email",
        primaryKey: "admin@monet.com",
      },
      timestamp: 1601710095359,
      resultJson: "{}", // in json
    },
  ],
  ProjectGroup: [
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

initializeDatabase();
export default db;
