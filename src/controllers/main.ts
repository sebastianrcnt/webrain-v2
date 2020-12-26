import { request, RequestHandler } from "express";
import { validationResult } from "express-validator";
import {
  ExperimentModel,
  IExperiment,
  IProject,
  IProjectGroup,
  IUser,
  IUserCreation,
  ProjectGroupModel,
  ProjectModel,
  UserModel,
  UserSchema,
} from "../database";
import { StatusCodes } from "../types/enums";
import { SyncHttpException } from "../types/errors";
import {
  RequestWithSession,
  ResponseWithSession,
} from "../types/interfaces/request";
import sendMessageWithRedirectionUrl from "../utils/redirect";

// Getters
export const getLoginPage: RequestHandler = (req, res) => {
  res.render("main/pages/login.hbs", {});
};

export const getRegisterPage: RequestHandler = (req, res) => {
  res.render("main/pages/register.hbs", {});
};

export const getProjectGroupsPage: RequestHandler = async (req, res) => {
  res.render("main/pages/project-groups", {
    projectGroups: await ProjectGroupModel.find({}),
  });
};

export const getProjectGroupPage: RequestHandler = async (req, res) => {
  const projectGroupId: string = req.params.projectGroupId;
  const projectGroup: IProjectGroup = (await ProjectGroupModel.findOne({
    id: projectGroupId,
  })) as IProjectGroup;
  const projects: IProject[] = (await ProjectModel.find({
    projectGroup: projectGroup._id,
  })) as IProject[];
  if (projectGroup) {
    res.render("main/pages/project-group", {
      projects,
      projectGroup,
    });
  } else {
    throw new SyncHttpException(
      `해당 id를 가진 프로젝트 그룹을 찾지 못했습니다`,
      StatusCodes.NOT_FOUND,
      "/main/project-groups"
    );
  }
};

export const getProjectPage: RequestHandler = async (req, res) => {
  const projectId: string = req.params.projectId;
  let project: IProject = (await ProjectModel.findOne({
    id: projectId,
  })) as IProject;
  let experiments = (await ExperimentModel.find({
    project: project._id,
  })) as IExperiment[];

  if (project) {
    res.render("main/pages/project", { project, experiments });
  } else {
    throw new SyncHttpException(
      `해당 id를 가진 프로젝트를 찾지 못했습니다`,
      StatusCodes.NOT_FOUND,
      "/main/project-groups"
    );
  }
};

export const getExperimentReadyPage: RequestHandler = async (req, res) => {
  const experimentId: string = req.params.experimentId;
  const experiment: IExperiment = (await ExperimentModel.findOne({
    id: experimentId,
  }).populate("project")) as IExperiment;

  const project: IProject = experiment.project;
  if (experiment && project) {
    res.render("main/pages/experiment", { experiment, project });
  } else {
    throw new SyncHttpException(
      `해당 id를 가진 실험을 찾지 못했습니다`,
      StatusCodes.NOT_FOUND,
      "/main/project-groups"
    );
  }
};

export const loginUser = async (
  req: RequestWithSession,
  res: ResponseWithSession
) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      req.session.user = user;
      res.redirect("/main");
    }
  } else {
    throw new SyncHttpException(
      "올바른 요청이 아닙니다",
      StatusCodes.BAD_REQUEST,
      "/main/login"
    );
  }
};

export const createUser = async (
  req: RequestWithSession,
  res: ResponseWithSession
) => {
  const { email, password, password2, name, phone } = req.body;
  const result = validationResult(req);
  if (result.isEmpty()) {
    if (password !== password2) {
      throw new SyncHttpException(
        "확인 비밀번호가 서로 일치하지 않습니다",
        StatusCodes.BAD_REQUEST,
        "/main/register"
      );
    }

    const userCreation: IUserCreation = { email, password, name, phone };
    await UserModel["register"](userCreation);
    sendMessageWithRedirectionUrl(res, "회원가입이 완료되었습니다", "/main/");
  } else {
    throw new SyncHttpException(
      "올바른 요청이 아닙니다",
      StatusCodes.BAD_REQUEST,
      "/main/register"
    );
  }
};

export const logoutUser = (
  req: RequestWithSession,
  res: ResponseWithSession
) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/main/login");
    }
  });
};