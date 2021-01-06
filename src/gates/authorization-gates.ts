import { NextFunction, RequestHandler } from "express";
import { IUser } from "../database";
import {
  RequestWithSession,
  ResponseWithSession,
} from "../types/interfaces/session";

export const levelAuthorizationGate = (
  level: number,
  redirectionUrl: string
) => {
  return (
    req: RequestWithSession,
    res: ResponseWithSession,
    next: NextFunction
  ) => {
    const user: IUser = req.session.user;
    if (user && user?.level >= level) {
      next();
    } else {
      res.redirect(redirectionUrl);
    }
  };
};
