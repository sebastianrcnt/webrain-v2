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
  UnimplementedExceptionSync,
  UnimplementedExceptionAsync,
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
  const { projectId, projectGroupId } = req.query;
  if (
    (await ProjectGroupModel.exists({ id: projectGroupId })) &&
    (await ProjectModel.exists({ id: projectId }))
  ) {
    const { projectId, projectGroupId } = req.query;
    const projectGroup: IProjectGroup = (await ProjectGroupModel.findOne({
      id: projectGroupId,
    }).lean()) as IProjectGroup;
    await ProjectModel.findOneAndUpdate(
      { id: projectId },
      { projectGroup: projectGroup._id }
    );
    res.send();
  } else {
    throw new HttpExceptionAsync("invalid id", 400);
  }
};

export const disassignProjectGroup: RequestHandler = async (req, res) => {
  const { projectId, projectGroupId } = req.query;
  if (
    (await ProjectGroupModel.exists({ id: projectGroupId })) &&
    (await ProjectModel.exists({ id: projectId }))
  ) {
    const projectGroup: IProjectGroup = (await ProjectGroupModel.findOne({
      id: projectGroupId,
    }).lean()) as IProjectGroup;
    await ProjectModel.findOneAndUpdate(
      { id: projectId },
      { projectGroup: null }
    );
    res.send();
  } else {
    throw new HttpExceptionAsync("invalid id", 400);
  }
};

export const assignExperimentToProject: RequestHandler = async (req, res) => {
  const { experimentId, projectId } = req.query;
  if (
    (await ProjectModel.exists({ id: projectId })) &&
    (await ExperimentModel.exists({ id: experimentId }))
  ) {
    await ExperimentModel.findOneAndUpdate(
      { id: experimentId },
      { project: (await ProjectModel.findOne({ id: projectId }))._id }
    );
    res.send();
  } else {
    throw new HttpExceptionAsync("invalid id", 400);
  }
};

export const disassignExperimentToProject: RequestHandler = async (
  req,
  res
) => {
  const { experimentId, projectId } = req.query;
  if (
    (await ProjectModel.exists({ id: projectId })) &&
    (await ExperimentModel.exists({ id: experimentId }))
  ) {
    await ExperimentModel.findOneAndUpdate(
      { id: experimentId },
      { project: null }
    );
    res.send();
  } else {
    throw new HttpExceptionAsync("invalid id", 400);
  }
};
