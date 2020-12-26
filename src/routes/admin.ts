import express, { Router } from "express";
import { body, param } from "express-validator";

// controllers
import * as AdminControllers from "../controllers/admin";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import { redirectionGate } from "../gates/redirection-gates";
import errorHandler from "../middlewares/error-handler";

const AdminRouter: Router = express();

// Public Users
// TODO: restrict other users
// AdminRouter.use(AuthorizationGates.levelAuthorizationGate(100, "/main/login"))
AdminRouter.get("/project-groups", AdminControllers.getProjectGroupsPage)
  .get("/project-groups/:projectGroupId", AdminControllers.getProjectGroupPage)
  .get("/", redirectionGate("/admin/project-groups"));
AdminRouter.use(errorHandler);
export default AdminRouter;
