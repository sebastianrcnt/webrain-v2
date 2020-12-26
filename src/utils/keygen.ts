import { PrimaryKey } from "../types/interfaces/models";
import shortid from "shortid";

export default function keygen(): PrimaryKey {
  return shortid.generate();
}
