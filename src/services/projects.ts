import db from "../types/database";
import { Project } from "../types/interfaces/models";

export function getAll(): Project[] {
  return db.get("projects").value();
}

export function getOneById(projectId): Project {
  return db.get("projects").find({ id: projectId }).value();
}

export function getAllByProjectGroupId(projectGroupId: string): Project[] {
  return db.get("projects").filter({ projectGroupId }).castArray().value();
}
