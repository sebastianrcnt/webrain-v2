import { RequestHandler } from "express";

export const levelAuthorizationGate = (
  level: number,
  redirectionUrl: string
): RequestHandler => {
  return (req, res, next) => {
    if (req["user"] && req["user"]?.level >= level) {
      next();
    } else {
      res.redirect(redirectionUrl);
    }
  };
};
