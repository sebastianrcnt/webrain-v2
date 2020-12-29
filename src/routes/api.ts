import express, { Router } from "express";
import { body, query, param } from "express-validator";

// controllers
import * as ApiControllers from "../controllers/api";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import { validationErrorHandlerASync } from "../middlewares/validation-error-handler";
import asyncHandler from "../utils/async-handler";

const ApiRouter: Router = express();

// Change Relation
ApiRouter.get(
  "/projects/assign-project-group",
  query("projectId").exists(),
  query("projectGroupId").exists(),
  validationErrorHandlerASync,
  asyncHandler(ApiControllers.assignProjectGroup)
)
  .get(
    "/projects/disassign-project-group",
    query("projectId").exists(),
    query("projectGroupId").exists(),
    validationErrorHandlerASync,
    asyncHandler(ApiControllers.disassignProjectGroup)
  )
  .get(
    "/experiments/assign-project",
    query("experimentId").exists(),
    query("projectId").exists(),
    asyncHandler(ApiControllers.assignExperimentToProject)
  )
  .get(
    "/experiments/disassign-project",
    query("experimentId").exists(),
    query("projectId").exists(),
    asyncHandler(ApiControllers.disassignExperimentToProject)
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
