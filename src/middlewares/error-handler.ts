import { ErrorRequestHandler } from "express";
import { CaughtError } from "../types/errors";
import { DatabaseError } from "../types/errors/database-errors"

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CaughtError) {
    res.status(500).render("error", {
      stack: err.stack,
      message: err.message,
      layout: "admin",
    });
  } else {
    res.status(500).render("error", {
      stack: err.stack,
      message: "확인되지 않은 오류입니다",
      layout: "admin",
    });
  }
};

export default errorHandler;
