import { RequestHandler } from "express";
import { validationResult, Result } from "express-validator";
import { IProjectGroup, ProjectGroupModel, ProjectModel } from "../database";
import { StatusCodes } from "../types/enums";
import { HttpExceptionAsync } from "../types/errors";

export const assignProjectGroup: RequestHandler = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { projectId, projectGroupId } = req.query;
    const projectGroup: IProjectGroup = (await ProjectGroupModel.findOne({
      id: projectGroupId,
    }).lean()) as IProjectGroup;
    if (projectGroup) {
      await ProjectModel.findOneAndUpdate(
        { id: projectId },
        { projectGroup: projectGroup._id }
      );
    }
    res.send();
  } else {
    throw new HttpExceptionAsync(
      "Validation Failed",
      StatusCodes.BAD_REQUEST,
      result
    );
  }
};

export const disassignProjectGroup: RequestHandler = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { projectId, projectGroupId } = req.query;
    const projectGroup: IProjectGroup = (await ProjectGroupModel.findOne({
      id: projectGroupId,
    }).lean()) as IProjectGroup;
    if (projectGroup) {
      await ProjectModel.findOneAndUpdate(
        { id: projectId },
        { projectGroup: null }
      );
    }
    res.send();
  } else {
    throw new HttpExceptionAsync(
      "Validation Failed",
      StatusCodes.BAD_REQUEST,
      result
    );
  }
};
