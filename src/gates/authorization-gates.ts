import { RequestHandler } from "express";
import * as UsersServices from "../services/users";
import { User } from "../types/interfaces/models";

export const levelAuthorizationGate = (
  level: number,
  redirectionUrl: string
): RequestHandler => {
  return (req, res, next) => {
    const user: User = req["session"]["user"];
    if (user && user?.level >= level) {
      next();
    } else {
      res.redirect(redirectionUrl);
    }
  };
};
