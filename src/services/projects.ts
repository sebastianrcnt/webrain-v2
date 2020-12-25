import db from "../database";
import { InvalidPrimaryKeyError } from "../types/errors/database-errors";
import { ModelName, PrimaryKey, Project } from "../types/interfaces/models";
import cascadeDatabase from "./cascade";

export function getAll(): Project[] {
  return db.get(ModelName.PROJECT).value();
}

export function getOneById(projectId: PrimaryKey): Project {
  return db.get(ModelName.PROJECT).find({ id: projectId }).value();
}

export function exists(projectId: PrimaryKey): boolean {
  return !!getOneById(projectId);
}

export function getAllByProjectGroupId(projectGroupId: PrimaryKey): Project[] {
  return db
    .get(ModelName.PROJECT)
    .filter(
      (project: Project) => project.projectGroup.primaryKey === projectGroupId
    )
    .castArray()
    .value();
}

export function remove(projectId: PrimaryKey) {
  const project: Project = getOneById(projectId);
  if (project) {
    db.get(ModelName.PROJECT).remove({ id: projectId }).write();
    cascadeDatabase(ModelName.PROJECT, projectId);
  } else {
    throw new InvalidPrimaryKeyError(ModelName.PROJECT_GROUP, projectId);
  }
}
