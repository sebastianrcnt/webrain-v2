import Model, { ModelName, PrimaryKey } from "./models";

export type ForeginKey = string;

export default interface Relation<M extends Model> {
  model: ModelName;
  foreginKey: ForeginKey; // name of foregin key (email, id, ... etc)
  primaryKey: PrimaryKey; // value of foregin key
}
