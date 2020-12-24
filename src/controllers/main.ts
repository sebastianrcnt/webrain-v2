import { RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";

export const getLoginPage: RequestHandler = (req, res) => {
  res.render("main/pages/login.hbs", { loggedInUser: false });
};

export const getRegisterPage: RequestHandler = (req, res) => {
  res.render("main/pages/register.hbs", {});
};

export const getProjectGroupsPage: RequestHandler = (req, res) => {
  res.render("main/pages/project-groups", {
    unitProjects: ProjectGroupServices.getAll(),
  });
};
