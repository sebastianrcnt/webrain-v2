import { RequestHandler } from "express";
import {
  ExperimentModel,
  IExperiment,
  IProject,
  IProjectGroup,
  IUser,
  IUserCreation,
  IExperimentCreation,
  ParticipationModel,
  ProjectGroupModel,
  ProjectModel,
  UserModel,
} from "../database";
import { StatusCodes } from "../types/enums";
import { HttpExceptionSync, UnimplementedExceptionSync } from "../types/errors";
import path from "path";
import extract from "extract-zip";
import Parser from "../services/parser";
import fs from "fs";
import sendMessageWithRedirectionUrl from "../utils/redirect";

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
    return !experiment.project?._id.equals(project._id);
  });
  let assignedExperiments = experiments.filter((experiment) => {
    return experiment.project?._id.equals(project._id);
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

export const updateProject: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

// Users
export const getUsersPage: RequestHandler = async (req, res) => {
  const users = await UserModel.find({}).lean();
  res.render("admin/pages/users", { layout: "admin", users });
};

export const getUserPage: RequestHandler = async (req, res) => {
  const userEmail = req.params.userEmail;
  const user: IUser = await UserModel.findOne({ email: userEmail }).lean();
  res.render("admin/pages/user", {
    layout: "admin",
    user,
  });
};

export const updateUser: RequestHandler = async (req, res) => {
  throw new UnimplementedExceptionSync();
};

// Experiments

export const getExperimentsPage: RequestHandler = async (req, res) => {
  const experiments = await ExperimentModel.find({})
    .populate({ path: "project", populate: { path: "author", model: "User" } })
    .lean();
  res.render("admin/pages/experiments", { layout: "admin", experiments });
};

export const getExperimentPage: RequestHandler = async (req, res) => {
  const experimentId = req.params.experimentId;
  const experiment = await ExperimentModel.findOne({ id: experimentId })
    .populate({ path: "project", populate: { path: "author", model: "User" } })
    .lean();
  res.render("admin/pages/experiment", { layout: "admin", experiment });
};

export const getNewExperimentPage: RequestHandler = async (req, res) => {
  res.render("admin/pages/experiments-new", { layout: "admin" });
};

export const createExperiment = async (req, res, next) => {
  const coverFile = req.files["cover"][0];
  const zipFile = req.files["zip"][0];

  try {
    console.log(zipFile);
    // extract
    let sourcedir = path.join(
      path.resolve(zipFile.destination),
      "source_" + zipFile.filename
    );

    fs.mkdirSync(sourcedir); // make directory /uploads/source_[experimentid]

    await extract(zipFile.path, {
      dir: sourcedir,
    });

    // read data
    const data = fs.readFileSync(
      path.join(
        sourcedir,
        path.parse(zipFile.originalname).name, // name = 1_lake_nback_i
        "exp.txt"
      ),
      "utf-8"
    );

    // parse data
    const parser = new Parser(data);
    const result = parser.execute().json();
    req.parseResultJson = result;
  } catch (error) {
    throw new HttpExceptionSync(
      "파싱하는 과정에서 오류가 발생했습니다",
      500,
      "/admin/experiments/new"
    );
  }

  // write to database
  const experiment: IExperimentCreation = {
    id: zipFile.filename,
    name: req.body.name,
    description: req.body.description,
    fileId: zipFile.filename, // filename = upload id..
    fileName: zipFile.originalname,
    coverFileId: coverFile.filename,
    instructionsJson: req.parseResultJson,
    tags: req.body.tags.trim(),
  };

  await ExperimentModel.create(experiment);

  sendMessageWithRedirectionUrl(
    res,
    "생성이 완료되었습니다",
    "/admin/experiments"
  );
};

export const updateExperiment = async (req, res, next) => {
  const { name, description, tags } = req.body;

  const coverFile = req.files["cover"] ? req.files["cover"][0] : null;
  const zipFile = req.files["zip"] ? req.files["zip"][0] : null;

  // if we need to update zipFile, do the work
  // read data
  if (zipFile) {
    let sourcedir = path.join(
      path.resolve(zipFile.destination), // /uploads
      "source_" + req.params.id // /source_experimentid
      // experimentId와 초기 업로드시 zipFile.filename이 동일하므로
      // 이렇게 접근할 수 있다.
    );

    await extract(zipFile.path, {
      dir: sourcedir,
    });

    try {
      const data = fs.readFileSync(
        path.join(
          sourcedir, // /uploads/experimentId
          path.parse(zipFile.originalname).name, // name = 1_lake_nback_i
          "exp.txt"
        ),
        // /uploads/experimentId/sample/exp.txt
        "utf-8"
      );

      // parse data
      const parser = new Parser(data);
      const result = parser.execute().json();
      req.parseResultJson = result;
    } catch (error) {
      console.error(error);
      throw new HttpExceptionSync(
        "파싱하는 과정에서 오류가 발생했습니다.",
        400,
        "/admin/experiments/new"
      );
    }
  }
  try {
    let nextExperiment = {
      name,
      description,
      tags,
      fileId: null,
      fileName: null,
      json: null,
    };
    if (coverFile) {
      nextExperiment["coverFileId"] = coverFile.filename;
    }
    if (zipFile) {
      nextExperiment = {
        ...nextExperiment,
        fileId: zipFile.filename, // filename = upload id..
        fileName: zipFile.originalname,
        json: req.parseResultJson,
      };
    }
    await ExperimentModel.updateOne({ id: req.params.id }, nextExperiment);
    sendMessageWithRedirectionUrl(
      res,
      "실험이 성공적으로 저장되었습니다",
      "/admin/experiments"
    );
  } catch (error) {
    console.error(error);
    throw new HttpExceptionSync(
      "데이터베이스 저장 중에 문제가 발생했습니다",
      500,
      "/admin/experiments/new"
    );
  }
};

export const getParticipationsPage: RequestHandler = async (req, res) => {
  const participations = await ParticipationModel.find({})
    .populate("participant")
    .populate({
      path: "experiment",
      populate: {
        path: "project",
        model: "Project",
      },
    })
    .lean();
  res.render("admin/pages/participations", { layout: "admin", participations });
};
