import db from "../database";
import { PrimaryKeyNotFoundException } from "../types/errors";
import {
  ModelName,
  PrimaryKey,
  ProjectGroup,
} from "../types/interfaces/models";
import keygen from "../utils/keygen";
import cascadeDatabase from "./cascade";

export function getAll(): ProjectGroup[] {
  return db.get(ModelName.PROJECT_GROUP).value();
}

export function getOneById(projectGroupId: PrimaryKey): ProjectGroup {
  return db.get(ModelName.PROJECT_GROUP).find({ id: projectGroupId }).value();
}

export function exists(projectGroupId: PrimaryKey): boolean {
  return !!getOneById(projectGroupId);
}

export function remove(projectGroupId: PrimaryKey): PrimaryKey {
  const projectGroup: ProjectGroup = getOneById(projectGroupId);
  if (projectGroup) {
    db.get(ModelName.PROJECT_GROUP).remove({ id: projectGroupId }).write();
    cascadeDatabase(ModelName.PROJECT_GROUP, projectGroupId);
    return projectGroupId;
  }
}

export function create(
  name: string,
  description: string,
  coverFileId: string
): PrimaryKey {
  const id: PrimaryKey = keygen();
  db.get(ModelName.PROJECT_GROUP)
    .push({ id, name, description, coverFileId })
    .write();
  return id;
}
