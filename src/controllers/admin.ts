import { RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";
import * as ProjectServices from "../services/projects";
import { PrimaryKeyNotFoundException } from "../types/errors";
import {
  ModelName,
  PrimaryKey,
  Project,
  ProjectGroup,
} from "../types/interfaces/models";

export const getProjectGroupsPage: RequestHandler = (req, res) => {
  const projectGroups: ProjectGroup[] = ProjectGroupServices.getAll();
  res.render("admin/pages/project-groups", { layout: "admin", projectGroups });
};

export const getProjectGroupPage: RequestHandler = (req, res) => {
  const projectGroupId: PrimaryKey = req.params.projectGroupId;
  const projectGroup: ProjectGroup = ProjectGroupServices.getOneById(
    projectGroupId
  );
  if (!projectGroup) {
    throw new PrimaryKeyNotFoundException(
      `해당 id를 가진 프로젝트를 찾지 못했습니다`,
      ModelName.PROJECT_GROUP,
      projectGroupId,
      "/admin/project-groups"
    );
  }
  const projects: Project[] = ProjectServices.getAllByProjectGroupId(
    projectGroupId
  );
  res.render("admin/pages/project-group", {
    layout: "admin",
    projectGroup,
    projects,
  });
};
