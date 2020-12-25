import Relation from "./relations";

export default interface Model {}

export type PrimaryKey = string;

export enum ModelName {
  USER = "User",
  PROJECT = "Project",
  EXPERIMENT = "Experiment",
  PARTICIPATION = "Participation",
  PROJECT_GROUP = "ProjectGroup",
}

export interface User extends Model {
  email: PrimaryKey;
  name: string;
  phone: string;
  password: string;
  level: number;
}

export interface Project extends Model {
  id: PrimaryKey;
  name: string;
  coverFileId: string;
  description: string;
  agreement: string;

  // Relations
  author: Relation<User>;
  projectGroup: Relation<ProjectGroup>;
}

export interface Experiment extends Model {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
  instructionsJson: string;

  // Relations
  project: Relation<Project>;
}

export interface Participation extends Model {
  timestamp: number;
  resultJson: string;

  // Relations
  experiment: Relation<Experiment>;
  participant: Relation<User>;
}

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  coverFileId: string;
}

export interface Database {
  User: User[];
  Project: Project[];
  Experiment: Experiment[];
  ProjectGroup: ProjectGroup[];
  Participation: Participation[];
}
