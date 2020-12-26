import { request, RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";
import * as ProjectServices from "../services/projects";
import * as ExperimentServices from "../services/experiments";
import * as UsersServices from "../services/users";
import { Experiment, ModelName, Project } from "../types/interfaces/models";
import {
  DatabaseAssertionFailureException,
  PrimaryKeyNotFoundException,
  ValidationFailureException,
} from "../types/errors";
import { validationResult } from "express-validator";

// Getters
export const getLoginPage: RequestHandler = (req, res) => {
  res.render("main/pages/login.hbs", {
    loggedInUser: false,
    flash: req["flash"] ? req["flash"]("message") : null,
  });
};

export const getRegisterPage: RequestHandler = (req, res) => {
  res.render("main/pages/register.hbs", {
    flash: req["flash"] ? req["flash"]("message") : null,
  });
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
    throw new PrimaryKeyNotFoundException(
      `해당 id를 가진 프로젝트 그룹을 찾지 못했습니다`,
      ModelName.PROJECT_GROUP,
      projectGroupId,
      "/main/project-groups"
    );
  }
};

export const getProjectPage: RequestHandler = (req, res) => {
  const projectId = req.params.projectId;
  let project = ProjectServices.getOneById(projectId);
  let experiments = ExperimentServices.getExperimentsOfProject(projectId);

  if (project) {
    res.render("main/pages/project", { project, experiments });
  } else {
    throw new PrimaryKeyNotFoundException(
      `해당 id를 가진 프로젝트를 찾지 못했습니다`,
      ModelName.PROJECT,
      projectId,
      "/main/project-groups"
    );
  }
};

export const getExperimentReadyPage: RequestHandler = (req, res) => {
  const experimentId = req.params.experimentId;
  const experiment: Experiment = ExperimentServices.getOneById(experimentId);
  if (experiment) {
    const projectId: string = experiment.project.primaryKey;
    const project: Project = ProjectServices.getOneById(projectId);
    if (project) {
      res.render("main/pages/experiment", { experiment, project });
    } else {
      throw new DatabaseAssertionFailureException(
        `Experiment ${experiment.id} has invalid Project id: ${project.id}`
      );
    }
  } else {
    throw new PrimaryKeyNotFoundException(
      `해당 id를 가진 실험을 찾지 못했습니다`,
      ModelName.EXPERIMENT,
      experimentId,
      "/main/project-groups"
    );
  }
};

export const loginUser: RequestHandler = (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { email, password } = req.body;
    const user = UsersServices.verify(email, password);
    req["session"]["user"] = user;
    res.redirect("/main");
  } else {
    throw new ValidationFailureException(
      "올바른 요청이 아닙니다",
      result,
      "/main/login"
    );
  }
};

export const createUser: RequestHandler = (req, res) => {
  const { email, password, password2, name, phone } = req.body;
  const result = validationResult(req);
  if (result.isEmpty()) {
    UsersServices.create(email, name, phone, password, 0);
    req["flash"]("message", "회원가입이 성공적으로 완료되었습니다");
    res.redirect("/main/login");
  } else {
    throw new ValidationFailureException(
      "올바른 요청이 아닙니다",
      result,
      "/main/register"
    );
  }
};

export const logoutUser: RequestHandler = (req, res) => {
  req["session"].destroy((error) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/main/login");
    }
  });
};

export const flash: RequestHandler = (req, res) => {
  res.render("utils/message", { message: req["flash"]("message") });
};
