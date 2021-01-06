import { Result } from "express-validator";
import keygen from "../../utils/keygen";
import { StatusCodes } from "../enums";

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
  id: string;
  constructor(message: string) {
    super(message);
    this.id = keygen();
  }
}

export abstract class HttpException extends Exception {
  statusCode: StatusCodes;
  validationResult?: Result;
  error?: Error;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class HttpExceptionSync extends HttpException {
  redirectionUrl: string;
  constructor(
    message: string,
    statusCode: StatusCodes,
    redirectionUrl: string,
    validationResult?: Result
  ) {
    super(message, statusCode);
    this.redirectionUrl = redirectionUrl;
    this.validationResult = validationResult;
  }
}

export class HttpExceptionAsync extends HttpException {
  constructor(
    message: string,
    statusCode: StatusCodes,
    validationResult?: Result
  ) {
    super(message, statusCode);
    this.validationResult = validationResult;
  }
}

export class UnimplementedExceptionAsync extends HttpExceptionAsync {
  constructor() {
    super("Unimplemented Feature", StatusCodes.NOT_IMPLEMENTED);
  }
}

export class UnimplementedExceptionSync extends HttpExceptionAsync {
  constructor() {
    super("Unimplemented Feature", StatusCodes.NOT_IMPLEMENTED);
  }
}
