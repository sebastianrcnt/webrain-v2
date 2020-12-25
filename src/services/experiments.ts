import _ from "lodash";
import db from "../types/database";
import { Experiment, Project } from "../types/interfaces";

export function getAll(): Experiment[] {
  return db.get("experiments").value();
}

export function getOneById(experimentId: string): Experiment {
  return db.get("experiments").find({ id: experimentId }).value();
}

export function getExperimentsOfProject(projectId: string): Experiment[] {
  return db.get("experiments").filter({ projectId }).castArray().value();
}
