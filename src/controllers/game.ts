import { RequestHandler } from "express";
import {
  ExperimentModel,
  IExperiment,
  IParticipation,
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
import fs from "fs";
import path from "path";
import { parse as parseJsonToCSV, Parser as jsonToCsvParser } from "json2csv";

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

  const alreadyExistingParticipation = await ParticipationModel.findOne({
    experiment: experiment._id,
    participant: req.session.user._id,
  })
    .populate("experiment")
    .populate("participant")
    .lean();
  if (alreadyExistingParticipation) {
    res.render("game/pages/game", {
      layout: "game",
      participation: alreadyExistingParticipation,
    });
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
  const resultJson = req.body.resultJson;
  await ParticipationModel.updateOne({ id: participationId }, { resultJson });
  res.send("Done");
};

export const getExperimentInstructions: RequestHandler = async (req, res) => {
  const { experimentId } = req.query;
  const experiment: IExperiment = await ExperimentModel.findOne({
    id: experimentId,
  }).lean();
  if (experiment) {
    res.json(experiment.instructionsJson);
  } else {
    throw new HttpExceptionAsync(`No experiment ${experimentId}`, 400);
  }
};

export const getParticipationResultsAsFile: RequestHandler = async (
  req: RequestWithSession,
  res
) => {
  const { participationId, type } = req.query;
  const participation: IParticipation = (await ParticipationModel.findOne({
    id: participationId,
  })) as IParticipation;
  if (!participation) {
    throw new HttpExceptionAsync(`No Participation ${participationId}`, 404);
  }

  if (type === "json") {
    const jsonPath = path.resolve("buffer/game-result.json");
    const jsonData = participation.resultJson;
    fs.writeFile(jsonPath, jsonData, (err) => {
      if (err) {
        throw err;
      } else {
        res.download(jsonPath);
      }
    });
  } else if (type === "csv") {
    const csvPath = path.resolve("buffer/game-result.csv");
    const parser = new jsonToCsvParser({
      fields: [
        "rt",
        "stimulus",
        "button_pressed",
        "trial_type",
        "trial_index",
        "time_elapsed",
        "internal_node_id",
        "correct_answer",
        "choices",
      ],
    });
    const csvData = parser.parse(JSON.parse(participation.resultJson));
    fs.writeFile(csvPath, csvData, (err) => {
      if (err) {
        throw err;
      } else {
        res.download(csvPath);
      }
    });
  } else {
    throw new HttpExceptionAsync(
      `Invalid Requested Result File Type ${type}`,
      400
    );
  }
};
