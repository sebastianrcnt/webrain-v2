import { RequestHandler } from "express";

export const redirectionGate = (redirectionUrl: string): RequestHandler => (
  req,
  res
) => {
  res.redirect(redirectionUrl);
};
