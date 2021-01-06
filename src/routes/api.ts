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
  asyncHandler(ApiControllers.deleteProjectGroup)
)
  .delete("/projects/:projectId", asyncHandler(ApiControllers.deleteProject))
  .delete(
    "/experiments/:experimentId",
    asyncHandler(ApiControllers.deleteExperiment)
  )
  .delete("/users/:userEmail", asyncHandler(ApiControllers.deleteUser))
  .delete(
    "/participations/:participationId",
    asyncHandler(ApiControllers.deleteParticipation)
  );

ApiRouter.get(
  "/experiments/duplicate",
  query("experimentId").exists(),
  query("userEmail").exists(),
  asyncHandler(ApiControllers.duplicateExperiment)
);

export default ApiRouter;
