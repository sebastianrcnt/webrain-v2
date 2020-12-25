import { request, RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";
import * as ProjectServices from "../services/projects";
import * as ExperimentServices from "../services/experiments";
import * as UsersServices from "../services/users";
import { Experiment, Project } from "../types/interfaces/models";
import {
  DatabaseCorruptionError,
  IdNotFoundError,
  AuthorizationFailedError,
  AlreadyExistsError,
} from "../types/errors/database-errors";
import { validationResult } from "express-validator";
import { BadRequestError } from "../types/errors/validation-errors";

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
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { email, password } = req.body;
    try {
      // Success
      const user = UsersServices.verify(email, password);
      if (user) {
        req["session"]["user"] = user;
        res.redirect("/main");
      } else {
        throw new Error("Fatal Error");
      }
    } catch (error) {
      // Fail. Reason?
      if (error instanceof AuthorizationFailedError) {
        req["flash"]("message", "비밀번호가 일치하지 않습니다");
      } else if (error instanceof IdNotFoundError) {
        req["flash"]("message", "존재하지 않는 이메일입니다");
      } else {
        throw error;
      }
      res.redirect("/main/login");
    }
  } else {
    console.log(result);
    throw new BadRequestError("Bad Request on Login(Verify)", result);
  }
};

export const createUser: RequestHandler = (req, res) => {
  const { email, password, password2, name, phone } = req.body;
  const result = validationResult(req);
  if (result.isEmpty()) {
    try {
      UsersServices.create(email, name, phone, password, 0);
      req["flash"]("message", "회원가입이 성공적으로 완료되었습니다");
      res.redirect("/main/login");
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        console.log(error);
        req["flash"]("message", "이미 존재하는 유저입니다");
      } else {
        throw error;
      }
      res.redirect("/main/register");
    }
  } else {
    throw new BadRequestError("Bad Request on Register", result);
  }
};

export const logoutUser: RequestHandler = (req, res) => {
  req["session"].destroy((error) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.redirect("/main/login");
    }
  });
};

export const flash: RequestHandler = (req, res) => {
  res.render("utils/message", { message: req["flash"]("message") });
};
