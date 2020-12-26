import db from "../database";
import { ModelName, PrimaryKey, Project } from "../types/interfaces/models";
import cascadeDatabase from "./cascade";
import * as ProjectGroupServices from "./project-groups";

export function getAll(): Project[] {
  return db
    .get(ModelName.PROJECT)
    .populateField("author")
    .populateField("projectGroup")
    .value();
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

export function remove(projectId: PrimaryKey): PrimaryKey {
  const project: Project = getOneById(projectId);
  if (project) {
    db.get(ModelName.PROJECT).remove({ id: projectId }).write();
    cascadeDatabase(ModelName.PROJECT, projectId);
    return projectId;
  }
}

export function assignProjectGroup(
  projectId: PrimaryKey,
  projectGroupId: PrimaryKey
): boolean {
  if (ProjectGroupServices.exists(projectGroupId)) {
    db.get(ModelName.PROJECT)
      .find({ id: projectId })
      .assign({
        projectGroup: {
          model: ModelName.PROJECT_GROUP,
          foreginKey: "id",
          primaryKey: projectGroupId,
        },
      })
      .write();
    return true;
  } else {
    return false;
  }
}

export function disassignProjectGroup(
  projectId: PrimaryKey,
  projectGroupId: PrimaryKey
): boolean {
  if (ProjectGroupServices.exists(projectGroupId)) {
    db.get(ModelName.PROJECT)
      .find({ id: projectId })
      .assign({
        projectGroup: {
          model: ModelName.PROJECT_GROUP,
          foreginKey: "id",
          primaryKey: null,
        },
      })
      .write();
    return true;
  } else {
    return false;
  }
}
