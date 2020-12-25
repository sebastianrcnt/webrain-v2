import { StatusCodes } from "../enums";
import { CaughtError, HttpStatusCodeSpecified } from ".";
import { ModelName, PrimaryKey } from "../interfaces/models";

export class DatabaseError extends CaughtError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidPrimaryKeyError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.NOT_FOUND;
  constructor(modelName: ModelName, primaryKey: PrimaryKey) {
    super(`${modelName} with primary key ${primaryKey} is not found`);
  }
}

export class AlreadyExistsError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.CONFLICT;
  constructor(modelName: ModelName, primaryKey: PrimaryKey) {
    super(`${modelName} with primary key ${primaryKey} is not found`);
  }
}

export class DatabaseCorruptionError extends DatabaseError {
  constructor(message: string) {
    super(message);
  }
}

export class AuthorizationFailedError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class InvalidModelNameError extends DatabaseError {
  constructor(modelName: ModelName) {
    super(`Model Name ${modelName} doesn't exist in database`);
  }
}
