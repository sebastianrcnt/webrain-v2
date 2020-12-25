import db from "../types/database";
import { ProjectGroup } from "../types/interfaces/models";

export function getAll(): ProjectGroup[] {
  return db.get("projectGroups").value();
}

export function getOneById(id): ProjectGroup {
  return db.get("projectGroups").find({ id }).value();
}
