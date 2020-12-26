import { ErrorRequestHandler } from "express";
import { format } from "path";
import { StatusCodes } from "../types/enums";
import {
  ApiException,
  ApiValidationException,
  Exception,
  ExternalException,
  InternalException,
} from "../types/errors";

const debug = process.env.DEBUG === "TRUE";

const errorHandler = (err, req, res, next) => {
  const statusCode: StatusCodes = err["statusCode"] || 500;
  console.log(err);
  if (debug) {
    debugErrorHandler(err, req, res, statusCode);
  } else {
    normalErrorHandler(err, req, res, statusCode);
  }
};

function debugErrorHandler(err, req, res, statusCode) {
  if (err instanceof Exception) {
    res.status(statusCode).render("error", {
      stack: err.stack,
      message: err.message,
      layout: "admin",
    });
  } else {
    res.status(statusCode).render("error", {
      stack: err.stack,
      message: "확인되지 않은 오류입니다",
      layout: "admin",
    });
  }
}

function normalErrorHandler(err, req, res, statusCode) {
  if (err instanceof InternalException) {
    res.status(statusCode).render("message", {
      layout: "admin",
      message: "오류가 발생했습니다",
    });
  } else if (err instanceof ExternalException) {
    res.status(statusCode).render("message-with-link", {
      layout: "admin",
      message: err.clientMessage,
      link: err.redirectionUrl,
    });
  } else {
    res.status(statusCode).render("message", {
      layout: "admin",
      message: "알 수 없는 오류가 발생했습니다",
    });
  }
}

export const apiErrorHandler = (err, req, res, next) => {
  res.status(500).json(err);
};

export default errorHandler;
