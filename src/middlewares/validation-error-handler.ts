import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "../types/enums";
import { HttpExceptionAsync, HttpExceptionSync } from "../types/errors";

export const validationErrorHandlerSync = (redirectionUrl: string) => (
  req,
  res,
  next
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new HttpExceptionSync(
      "Validation Failed",
      StatusCodes.BAD_REQUEST,
      redirectionUrl,
      result
    );
  } else {
    next();
  }
};

export const validationErrorHandlerASync: RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new HttpExceptionAsync(
      "Validation Failed",
      StatusCodes.BAD_REQUEST,
      result
    );
  } else {
    next();
  }
};
