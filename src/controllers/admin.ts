import { RequestHandler } from "express";
import {
  IProject,
  IProjectGroup,
  ProjectGroupModel,
  ProjectModel,
} from "../database";
import { StatusCodes } from "../types/enums";
import { HttpException, SyncHttpException } from "../types/errors";

export const getProjectGroupsPage: RequestHandler = (req, res) => {
  const projectGroups = ProjectGroupModel.find({}).exec();
  res.render("admin/pages/project-groups", { layout: "admin", projectGroups });
};

export const getProjectGroupPage: RequestHandler = async (req, res) => {
  const projectGroupId = req.params.projectGroupId;
  const projectGroup = await ProjectGroupModel.findOne({
    id: projectGroupId,
  }).exec();
  if (!projectGroup) {
    throw new SyncHttpException(
      `해당 id를 가진 프로젝트를 찾지 못했습니다`,
      StatusCodes.NOT_FOUND,
      "/admin/project-groups"
    );
  }
  const projects = await ProjectGroupModel.find({}).populate("projectGroup");
  const assignedProjects = projects.filter(
    (project) => (project as IProject).projectGroup.id === projectGroupId
  );
  res.render("admin/pages/project-group", {
    layout: "admin",
    assignedProjects,
    projectGroup,
    projects,
  });
};
