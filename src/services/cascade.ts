import Model, {
  Database,
  ModelName,
  PrimaryKey,
} from "../types/interfaces/models";
import db from "../database";
import Relation from "../types/interfaces/relations";

export default function cascadeDatabase(
  targetModelName: ModelName,
  primaryKey: PrimaryKey // 'projectgroup1'
) {
  let prevDatabaseState: Database = db.getState();
  // Cascade All models containing given foreginKeyName
  for (let modelName in ModelName) {
    prevDatabaseState[modelName] = prevDatabaseState[modelName].filter(
      (document: Model) => {
        for (let fieldName in document) {
          const field: Relation<Model> = document[fieldName];
          if (
            field.model === targetModelName &&
            field.primaryKey && // not null
            field.primaryKey === primaryKey
          ) {
            return false;
          }
        }
        return true;
      }
    );
  }
  // return new database state
  db.setState(prevDatabaseState);
}
