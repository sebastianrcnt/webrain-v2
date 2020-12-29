import { RequestHandler } from "express";
import {
  ExperimentModel,
  IExperiment,
  IProject,
  IProjectGroup,
  ProjectGroupModel,
  ProjectModel,
} from "../database";
import ProjectServices from "../services/projects";
import { StatusCodes } from "../types/enums";
import { HttpExceptionSync, UnimplementedExceptionSync } from "../types/errors";

export const getProjectGroupsPage: RequestHandler = async (req, res) => {
  const projectGroups = await ProjectGroupModel.find({}).lean();
  res.render("admin/pages/project-groups", { layout: "admin", projectGroups });
};

export const getProjectGroupPage: RequestHandler = async (req, res) => {
  const projectGroupId = req.params.projectGroupId;
  const projectGroup = await ProjectGroupModel.findOne({
    id: projectGroupId,
  }).lean();
  if (!projectGroup) {
    throw new HttpExceptionSync(
      `해당 id를 가진 프로젝트를 찾지 못했습니다`,
      StatusCodes.NOT_FOUND,
      "/admin/project-groups"
    );
  }
  const projects = await ProjectModel.find({})
    .populate("projectGroup")
    .populate("author")
    .lean();
  const assignedProjects = projects.filter(
    (project) => project.projectGroup?.id === projectGroupId
  );
  res.render("admin/pages/project-group", {
    layout: "admin",
    assignedProjects,
    projectGroup,
    projects,
  });
};

export const getNewProjectGroupPage: RequestHandler = async (req, res) => {
  res.render("admin/pages/project-group-new", { layout: "admin" });
};

export const createProjectGroup: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

export const deleteProjectGroup: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

export const updateProjectGroup: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

// Projects
export const getProjectsPage: RequestHandler = async (req, res) => {
  const projects = await ProjectModel.find({}).populate("author").lean();
  res.render("admin/pages/projects", { layout: "admin", projects });
};

export const getProjectPage: RequestHandler = async (req, res) => {
  const projectId = req.params.projectId;
  const project: IProject = await ProjectModel.findOne({ id: projectId })
    .populate("author")
    .lean();
  let experiments: IExperiment[] = await ExperimentModel.find({})
    .populate("project")
    .lean();
  let unassignedExperiments = experiments.filter((experiment) => {
    return experiment.project._id.equals(project._id);
  });
  let assignedExperiments = experiments.filter((experiment) => {
    return experiment.project._id.equals(project._id);
  });
  res.render("admin/pages/project", {
    layout: "admin",
    project,
    unassignedExperiments,
    assignedExperiments,
  });
};

export const getNewProjectPage: RequestHandler = async (req, res) => {
  res.render("admin/pages/project-new", { layout: "admin" });
};

export const createProject: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

export const deleteProject: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

export const updateProject: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};
