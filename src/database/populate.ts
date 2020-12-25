import Model, { ModelName } from "../types/interfaces/models";
import Relation from "../types/interfaces/relations";
import db from "../database";

export default function populate(model: Model, modelName: ModelName) {
  for (let key in model) {
    // is property a relationship?
    const relation: Relation<Model> = model[key]; // Relation
    if (relation.model) {
      // yes!
      if (relation.model === modelName) {
        db.get(relation.model)
          .find({ [relation.foreginKey]: relation.primaryKey })
          .value();
      }
    }
  }
}

function r() {}
