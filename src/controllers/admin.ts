import { RequestHandler } from "express";
import * as ProjectGroupServices from "../services/project-groups";
import { ProjectGroup } from "../types/interfaces/models";

export const getProjectGroupsPage: RequestHandler = (req, res) => {
  const projectGroups: ProjectGroup[] = ProjectGroupServices.getAll();
  res.render("admin/pages/project-groups", { layout: "admin", projectGroups });
};
