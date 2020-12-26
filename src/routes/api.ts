import express, { Router } from "express";
import { body, query, param } from "express-validator";

// controllers
import * as ApiControllers from "../controllers/api";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import asyncHandler from "../utils/async-handler";

const ApiRouter: Router = express();

// Public Users
// TODO: restrict other users
ApiRouter.get(
  "/projects/assign-project-group",
  query("projectId").exists(),
  query("projectGroupId").exists(),
  asyncHandler(ApiControllers.assignProjectGroup)
).get(
  "/projects/disassign-project-group",
  query("projectId").exists(),
  query("projectGroupId").exists(),
  asyncHandler(ApiControllers.disassignProjectGroup)
);
export default ApiRouter;
