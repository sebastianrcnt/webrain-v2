import express, { Router } from "express";
import { body, query, param } from "express-validator";

// controllers
import * as ApiControllers from "../controllers/api";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import errorHandler from "../middlewares/error-handler";

const ApiRouter: Router = express();

// Public Users
// TODO: restrict other users
ApiRouter.get(
  "/projects/assign-project-group",
  query("projectId").exists(),
  query("projectGroupId").exists(),
  ApiControllers.assignProjectGroup
).get(
  "/projects/disassign-project-group",
  query("projectId").exists(),
  query("projectGroupId").exists(),
  ApiControllers.disassignProjectGroup
);
ApiRouter.use(errorHandler);
export default ApiRouter;
