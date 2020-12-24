import db from "../database";
import { ProjectGroup } from "../types/interfaces";

export function getAll(): ProjectGroup[] {
  return db.get("projectGroups").value();
}
