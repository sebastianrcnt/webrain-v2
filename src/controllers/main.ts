import { RequestHandler } from "express";

export const getLoginPage: RequestHandler = (req, res) => {
  res.render("main/pages/login.hbs", { loggedInUser: false });
};

export const getRegisterPage: RequestHandler = (req, res) => {
  res.render("main/pages/register.hbs", {});
};

export const getUnitProjectsPage: RequestHandler = (req, res) => {
  res.render("main/pages/unit-projects", {});
};
