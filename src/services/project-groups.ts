import shortid from "shortid";

import db from "../database";
import { InvalidPrimaryKeyError } from "../types/errors/database-errors";
import { ModelName, PrimaryKey, ProjectGroup } from "../types/interfaces/models";
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

export function remove(projectGroupId: PrimaryKey) {
  const projectGroup: ProjectGroup = getOneById(projectGroupId);
  if (projectGroup) {
    db.get(ModelName.PROJECT_GROUP).remove({ id: projectGroupId }).write();
    cascadeDatabase(ModelName.PROJECT_GROUP, projectGroupId);
  } else {
    throw new InvalidPrimaryKeyError(ModelName.PROJECT_GROUP, projectGroupId);
  }
}

export function create(
  name: string,
  description: string,
  coverFileId: string
): string {
  const id = shortid.generate();
  db.get(ModelName.PROJECT_GROUP)
    .push({ id, name, description, coverFileId })
    .write();
  return id;
}
