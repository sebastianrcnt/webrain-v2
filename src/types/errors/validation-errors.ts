import { StatusCodes } from "../enums";
import { CaughtError, HttpStatusCodeSpecified } from ".";
import expressValidator, { ValidationError } from "express-validator";

export class BadRequestError
  extends CaughtError
  implements HttpStatusCodeSpecified {
  statusCode = StatusCodes.BAD_REQUEST;
  validationResult: expressValidator.Result;
  constructor(message: string, validationResult: expressValidator.Result) {
    super(message);
    this.validationResult = validationResult;
  }

  public format(): string {
    const errors: any[] = this.validationResult['errors'];
    return errors.map((error: ValidationError) => `[${error.msg}] - Validation Failed On Value ${error.value} of Param ${error.param} at ${error.location}`).join('\n')
  }
}
