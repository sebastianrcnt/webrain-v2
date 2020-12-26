import { ErrorRequestHandler } from "express";
import { StatusCodes } from "../types/enums";
import {
  HttpExceptionAsync,
  Exception,
  HttpExceptionSync,
} from "../types/errors";
import keygen from "../utils/keygen";

const debug = process.env.DEBUG === "TRUE";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode: StatusCodes = err["statusCode"] || 500;
  let reportId = keygen();
  if (err instanceof Exception) {
    reportId = err.id;
  }
  // Todo Incidence Report
  console.log(err);
  if (debug) {
    debugErrorHandler(err, req, res, statusCode);
  } else {
    normalErrorHandler(err, req, res, statusCode);
  }
};

function debugErrorHandler(err, req, res, statusCode) {
  if (err instanceof Exception) {
    if (err instanceof HttpExceptionSync) {
      res.status(statusCode).render("error", {
        stack: err.stack,
        message: err.message,
        layout: "admin",
      });
    } else if (err instanceof HttpExceptionAsync) {
      res.status(statusCode).send(err);
    }
  } else {
    res.status(statusCode).json(err);
  }
}

function normalErrorHandler(err, req, res, statusCode) {
  if (err instanceof Exception) {
    if (err instanceof HttpExceptionSync) {
      res.status(statusCode).render("message-with-link", {
        layout: "admin",
        message: err.message,
        link: err.redirectionUrl,
      });
    } else if (err instanceof HttpExceptionAsync) {
      res.status(statusCode).render("message", {
        layout: "admin",
        message: "오류가 발생했습니다",
      });
    }
  } else {
    res.status(statusCode).json(err);
  }
}

export default errorHandler;
