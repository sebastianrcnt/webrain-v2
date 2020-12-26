import { StatusCodes } from "../enums";
import expressValidator, { Result, ValidationError } from "express-validator";
import { ModelName, PrimaryKey } from "../interfaces/models";
import Relation from "../interfaces/relations";

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

// Predicted Error
export abstract class Exception extends ExtendableError {
  constructor(message: string) {
    super(message);
  }
}

// Error That Needs to be Notified to User
// Should be thrown at controllers, Contains Information about Response
// Sends Message Regardless of
export abstract class ExternalException
  extends Exception
  implements HttpStatusCodeSpecified {
  clientMessage: string;
  statusCode: StatusCodes;
  redirectionUrl: string;

  constructor(
    message: string,
    clientMessage: string,
    statusCode: StatusCodes,
    redirectionUrl: string
  ) {
    super(message);
    this.clientMessage = clientMessage;
    this.statusCode = statusCode;
    this.redirectionUrl = redirectionUrl;
  }
}

export class ValidationFailureException extends ExternalException {
  validationResult: expressValidator.Result;
  errors: any[];
  constructor(
    clientMessage: string,
    validationResult: expressValidator.Result,
    redirectionUrl: string
  ) {
    super(
      `Validation Failed`,
      clientMessage,
      StatusCodes.BAD_REQUEST,
      redirectionUrl
    );
    this.validationResult = validationResult;
    this.errors = validationResult["errors"];
  }

  public format(): string {
    return this.errors
      .map(
        (error: ValidationError) =>
          `[${error.msg}] - Validation Failed On Value ${error.value} of Param ${error.param} at ${error.location}`
      )
      .join("\n");
  }
}

export abstract class PrimaryKeyException extends ExternalException {
  modelName: ModelName;
  primaryKey: PrimaryKey;

  constructor(
    message: string,
    clientMessage: string,
    statusCode: StatusCodes,
    modelName: ModelName,
    primaryKey: PrimaryKey,
    redirectionUrl: string
  ) {
    super(message, clientMessage, statusCode, redirectionUrl);
    this.modelName = modelName;
    this.primaryKey = primaryKey;
  }
}

export class DuplicatePrimaryKeyException extends PrimaryKeyException {
  constructor(
    clientMessage: string,
    modelName: ModelName,
    primaryKey: PrimaryKey,
    redirectionUrl: string
  ) {
    super(
      `${modelName} with primary key ${primaryKey} is not found`,
      clientMessage,
      StatusCodes.CONFLICT,
      modelName,
      primaryKey,
      redirectionUrl
    );
  }
}

export class PrimaryKeyNotFoundException extends PrimaryKeyException {
  constructor(
    clientMessage: string,
    modelName: ModelName,
    primaryKey: PrimaryKey,
    redirectionUrl: string
  ) {
    super(
      `${modelName} with primary key ${primaryKey} already exists`,
      clientMessage,
      StatusCodes.NOT_FOUND,
      modelName,
      primaryKey,
      redirectionUrl
    );
  }
}

export class AuthorizationFailureException extends ExternalException {
  constructor(clientMessage: string, redirectionUrl: string) {
    super(
      `Authorization Failed`,
      clientMessage,
      StatusCodes.UNAUTHORIZED,
      redirectionUrl
    );
  }
}

// Error Caused by System -> Sends Message if debug option is set
export abstract class InternalException extends Exception {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseAssertionFailureException extends InternalException {
  constructor(message: string) {
    super(message);
  }
}

export class ApiException extends Exception {
  error?: any[];
  constructor(message: string, error?: any) {
    super(message);
    this.error = error;
  }
}

export class ApiValidationException
  extends ApiException
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes.BAD_REQUEST;
  validationResult: Result;
  constructor(message, validationResult?: Result) {
    super(message);
    this.validationResult = validationResult;
  }
}
