import { RequestHandler } from "express";
import { validationResult, Result } from "express-validator";
import * as ProjectGroupServices from "../services/project-groups";
import * as ProjectServices from "../services/projects";
import { ApiValidationException, Exception } from "../types/errors";
import {
  ModelName,
  PrimaryKey,
  Project,
  ProjectGroup,
} from "../types/interfaces/models";

export const getProjects: RequestHandler = (req, res) => {
  let projects = ProjectServices.getAll();
  res.json(projects);
};

export const assignProjectGroup: RequestHandler = (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { projectId, projectGroupId } = req.query;
    if (
      ProjectServices.assignProjectGroup(
        projectId as PrimaryKey,
        projectGroupId as PrimaryKey
      )
    ) {
      res.status(200).send()
    } else {
      res.status(400).send()
    }
  } else {
    throw new ApiValidationException("Validation Failed", result);
  }
};

export const disassignProjectGroup: RequestHandler = (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { projectId, projectGroupId } = req.query;
    if (
      ProjectServices.disassignProjectGroup(
        projectId as PrimaryKey,
        projectGroupId as PrimaryKey
      )
    ) {
      res.status(200).send()
    } else {
      res.status(400).send()
    }
  } else {
    throw new ApiValidationException("Validation Failed", result);
  }
};
