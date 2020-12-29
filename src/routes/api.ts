import express, { Router } from "express";
import { body, query, param } from "express-validator";

// controllers
import * as ApiControllers from "../controllers/api";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import asyncHandler from "../utils/async-handler";

const ApiRouter: Router = express();

// Change Relation
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

// Delete
ApiRouter.delete(
  "/projectGroups/:projectGroupId",
  ApiControllers.deleteProjectGroup
)
  .delete("/projects/:projectId", ApiControllers.deleteProject)
  .delete("/experiments/:experimentId", ApiControllers.deleteExperiment)
  .delete("/users/:userEmail", ApiControllers.deleteUser)
  .delete(
    "/participations/:participationId",
    ApiControllers.deleteParticipation
  );

export default ApiRouter;
