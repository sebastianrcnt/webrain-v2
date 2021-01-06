import shortid from "shortid";

export default function keygen(): string {
  return shortid.generate();
}
