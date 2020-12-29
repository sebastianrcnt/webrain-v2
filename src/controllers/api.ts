import { RequestHandler } from "express";
import { validationResult, Result } from "express-validator";
import {
  ExperimentModel,
  IProjectGroup,
  ParticipationModel,
  ProjectGroupModel,
  ProjectModel,
  UserModel,
} from "../database";
import { StatusCodes } from "../types/enums";
import {
  HttpExceptionAsync,
} from "../types/errors";

export const deleteProjectGroup: RequestHandler = async (req, res) => {
  const projectGroupId = req.params.projectGroupId;
  const result = await ProjectGroupModel.deleteOne({ id: projectGroupId });
  if (result.n > 0) {
    res.status(200).send(result);
  } else {
    res.status(404).send(result);
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  const projectId = req.params.projectId;
  const result = await ProjectModel.deleteOne({ id: projectId });
  if (result.n > 0) {
    res.status(200).send(result);
  } else {
    res.status(404).send(result);
  }
};

export const deleteExperiment: RequestHandler = async (req, res) => {
  const experimentId = req.params.experimentId;
  const result = await ExperimentModel.deleteOne({ id: experimentId });
  if (result.n > 0) {
    res.status(200).send(result);
  } else {
    res.status(404).send(result);
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const userEmail = req.params.userEmail;
  const result = await UserModel.deleteOne({ email: userEmail });
  if (result.n > 0) {
    res.status(200).send(result);
  } else {
    res.status(404).send(result);
  }
};
export const deleteParticipation: RequestHandler = async (req, res) => {
  const participationId = req.params.participationId;
  const result = await ParticipationModel.deleteOne({ id: participationId });
  if (result.n > 0) {
    res.status(200).send(result);
  } else {
    res.status(404).send(result);
  }
};

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
