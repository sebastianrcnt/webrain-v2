import { RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";
import * as ProjectServices from "../services/projects";
import * as ExperimentServices from "../services/experiments";
import * as UsersServices from "../services/users";
import { Experiment, Project, ProjectGroup } from "../types/interfaces";
import {
  CaughtError,
} from "../types/errors";
import {
  DatabaseError,
  DatabaseCorruptionError,
  IdNotFoundError
} from "../types/errors/database-errors"
import { validationResult } from "express-validator";

// Getters
export const getLoginPage: RequestHandler = (req, res) => {
  res.render("main/pages/login.hbs", { loggedInUser: false });
};

export const getRegisterPage: RequestHandler = (req, res) => {
  res.render("main/pages/register.hbs", {});
};

export const getProjectGroupsPage: RequestHandler = (req, res) => {
  res.render("main/pages/project-groups", {
    projectGroups: ProjectGroupServices.getAll(),
  });
};

export const getProjectGroupPage: RequestHandler = (req, res) => {
  const projectGroupId = req.params.projectGroupId;
  const projectGroup = ProjectGroupServices.getOneById(projectGroupId);
  const projects = ProjectServices.getAllByProjectGroupId(projectGroupId);
  console.log({ projects });

  if (projectGroup) {
    res.render("main/pages/project-group", {
      projects,
      projectGroup,
    });
  } else {
    throw new IdNotFoundError("Project Group", projectGroupId);
  }
};

export const getProjectPage: RequestHandler = (req, res) => {
  const projectId = req.params.projectId;
  let project = ProjectServices.getOneById(projectId);
  let experiments = ExperimentServices.getExperimentsOfProject(projectId);

  if (project) {
    res.render("main/pages/project", { project, experiments });
  } else {
    throw new IdNotFoundError("Project", projectId);
  }
};

export const getExperimentReadyPage: RequestHandler = (req, res) => {
  const experimentId = req.params.experimentId;
  const experiment: Experiment = ExperimentServices.getOneById(experimentId);
  if (experiment) {
    const projectId: string = experiment.projectId;
    const project: Project = ProjectServices.getOneById(projectId);
    if (project) {
      res.render("main/pages/experiment", { experiment, project });
    } else {
      throw new DatabaseCorruptionError(
        `Experiment ${experiment.id} has invalid Project id: ${project.id}`
      );
    }
  } else {
    throw new IdNotFoundError("Experiment", experimentId);
  }
};

export const loginUser: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // No Errors

  } else {

  }
};

export const createUser: RequestHandler = (req, res) => {};
