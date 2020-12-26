import { RequestHandler } from "express";
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
