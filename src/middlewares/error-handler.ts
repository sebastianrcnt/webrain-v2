import { ErrorRequestHandler } from "express";
import { format } from "path";
import { CaughtError } from "../types/errors";
import { BadRequestError } from "../types/errors/validation-errors";

const errorHandler = (err, req, res, next) => {
  const statusCode = err["statusCode"] || 500;
  console.log(err);
  if (err instanceof BadRequestError) {
    res.status(statusCode).render("error", {
      stack: err.format(),
      message: err.message,
      layout: "admin",
    });
  } else if (err instanceof CaughtError) {
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
};

export default errorHandler;
