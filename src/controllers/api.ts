import { RequestHandler } from "express";
import { validationResult, Result } from "express-validator";
import {
  ExperimentModel,
  IExperiment,
  IExperimentCreation,
  insertSampleToDatabase,
  IProject,
  IProjectGroup,
  IUser,
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
import fs from "fs";
import path from "path";
import keygen from "../utils/keygen";
import fse from "fs-extra";

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

// todo - duplicate project on template
// todo - open experiment to user
export const duplicateExperiment: RequestHandler = async (req, res) => {
  const experimentId = req.query.experimentId;
  const userEmail = req.query.userEmail;
  const experiment: IExperiment = await ExperimentModel.findOne({
    id: experimentId,
  }).lean();
  const user: IUser = await UserModel.findOne({ email: userEmail }).lean();
  if (user && experiment) {
    // copy experiment files
    const newKey = keygen();
    const newCoverFileId = keygen();
    // copy zipfile
    fse.copySync(`uploads/${experiment.id}`, `uploads/${newKey}`);
    fse.copySync(`uploads/${experiment.coverFileId}`, `uploads/${newKey}`);
    fse.copySync(`uploads/source_${experiment.id}`, `uploads/${newKey}`);
    const newExperiment: IExperimentCreation = {
      id: newKey,
      name: experiment.name,
      description: experiment.description,
      fileId: newKey,
      fileName: experiment.fileName,
      coverFileId: newCoverFileId,
      instructionsJson: experiment.instructionsJson,
      public: false,
      author: null,
      tags: experiment.tags,
    };
    await ExperimentModel.create(newExperiment);
    res.status(201).send("성공적으로 복사되었습니다");
  } else {
    throw new HttpExceptionAsync(
      "유효한 유저 혹은 실험을 찾지 못했습니다",
      400
    );
  }
};

// todo - impolement assignment
export const assignParticipantToProject: RequestHandler = async (req, res) => {
  const { participantEmail, projectId } = req.query;
  const participant = await UserModel.findOne({ email: participantEmail });
  if (participant) {
    await ProjectModel.updateOne(
      { id: projectId },
      { $push: { participants: participant } }
    );
  }
  res.json({ participantEmail, projectId });
};

export const disassignParticipantToProject: RequestHandler = async (
  req,
  res
) => {
  const { participantEmail, projectId } = req.query;
  const participant = await UserModel.findOne({ email: participantEmail });
  if (participant) {
    await ProjectModel.updateOne(
      { id: projectId },
      { $pull: { participants: participant._id } }
    );
  }
  res.json({ participantEmail, projectId });
};
