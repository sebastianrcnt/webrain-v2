import _ from "lodash";
import db from "../database";
import { Experiment, PrimaryKey } from "../types/interfaces/models";

export function getAll(): Experiment[] {
  return db.get("Experiment").value();
}

export function getOneById(experimentId: PrimaryKey): Experiment {
  return db.get("Experiment").find({ id: experimentId }).value();
}

export function getExperimentsOfProject(projectId: PrimaryKey): Experiment[] {
  return db
    .get("Experiment")
    .filter(
      (experiment: Experiment) => experiment.project.primaryKey === projectId
    )
    .castArray()
    .value();
}
