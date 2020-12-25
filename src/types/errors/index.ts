import { StatusCodes } from "../enums";

export interface HttpStatusCodeSpecified {
  statusCode?: StatusCodes;
}

export abstract class ExtendableError extends Error {
  constructor(message?: string) {
    // 'Error' breaks prototype chain here
    super(message);

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
  }
}

export abstract class CaughtError extends ExtendableError {
  constructor(message: string) {
    super(message);
  }
}
