import { RequestHandler } from "express";
import {
  ExperimentModel,
  IExperiment,
  IParticipationCreation,
  ParticipationModel,
} from "../database";
import {
  HttpExceptionAsync,
  HttpExceptionSync,
  UnimplementedExceptionAsync,
  UnimplementedExceptionSync,
} from "../types/errors";
import { RequestWithSession } from "../types/interfaces/session";
import keygen from "../utils/keygen";

export const getGamePage: RequestHandler = async (
  req: RequestWithSession,
  res
) => {
  const { experimentId } = req.query;
  const experiment = await ExperimentModel.findOne({ id: experimentId });
  if (!experiment) {
    throw new HttpExceptionSync(
      `Experiment ${experimentId} not found`,
      404,
      "/main/"
    );
    return;
  }

  const participationId = keygen();
  const participationCreation: IParticipationCreation = {
    id: participationId,
    experiment: experiment._id,
    participant: req.session.user._id,
    timestamp: Date.now(),
    resultJson: "{}",
  };

  await ParticipationModel.create(participationCreation);
  const participation = await ParticipationModel.findOne({
    id: participationId,
  })
    .populate("experiment")
    .populate("participant")
    .lean();

  res.render("game/pages/game", { layout: "game", participation });
};

export const submit: RequestHandler = async (req, res) => {
  const { participationId } = req.query;
  const resultJson = JSON.parse(req.body.resultJson);
  await ParticipationModel.updateOne({ id: participationId }, { resultJson });
  res.send(resultJson);
};

export const getGameInstructions: RequestHandler = async (req, res) => {
  const { experimentId } = req.query;
  const experiment: IExperiment = await ExperimentModel.findOne({
    id: experimentId,
  }).lean();
  if (experiment) {
    console.log(experiment);
    res.json(experiment.instructionsJson);
  } else {
    throw new HttpExceptionAsync(`No experiment ${experimentId}`, 400);
  }
};
