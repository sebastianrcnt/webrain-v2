import express, { Router } from "express";
import { body, param } from "express-validator";

// controllers
import * as AdminControllers from "../controllers/admin";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import { redirectionGate } from "../gates/redirection-gates";
import errorHandler from "../middlewares/error-handler";
import {
  experimentsUploader,
  projectGroupsUploader,
  projectsUploader,
} from "../services/uploaders";
import asyncHandler from "../utils/async-handler";

const AdminRouter: Router = express();

// Public Users
// TODO: restrict other users
AdminRouter.use(AuthorizationGates.levelAuthorizationGate(100, "/main/login"));
AdminRouter.get(
  "/project-groups",
  asyncHandler(AdminControllers.getProjectGroupsPage)
)
  .get(
    "/project-groups/new",
    asyncHandler(AdminControllers.getNewProjectGroupPage)
  )
  .get(
    "/project-groups/:projectGroupId",
    asyncHandler(AdminControllers.getProjectGroupPage)
  )
  .post(
    "/project-groups",
    projectGroupsUploader,
    asyncHandler(AdminControllers.createProjectGroup)
  )
  .post(
    "/project-groups/:projectGroupId",
    asyncHandler(AdminControllers.updateProjectGroup)
  );

AdminRouter.get("/projects", asyncHandler(AdminControllers.getProjectsPage))
  .get("/projects/new", asyncHandler(AdminControllers.getNewProjectPage))
  .get("/projects/:projectId", asyncHandler(AdminControllers.getProjectPage))
  .post(
    "/projects",
    projectsUploader,
    asyncHandler(AdminControllers.createProject)
  )
  .post(
    "/projects/:projectId",
    projectsUploader,
    asyncHandler(AdminControllers.updateProject)
  );

AdminRouter.get("/users", asyncHandler(AdminControllers.getUsersPage)).get(
  "/users/:userEmail",
  asyncHandler(AdminControllers.getUserPage)
);

AdminRouter.get(
  "/experiments",
  asyncHandler(AdminControllers.getExperimentsPage)
)
  .get("/experiments/new", asyncHandler(AdminControllers.getNewExperimentPage))
  .get(
    "/experiments/:experimentId",
    asyncHandler(AdminControllers.getExperimentPage)
  )
  .post(
    "/experiments",
    experimentsUploader,
    asyncHandler(AdminControllers.createExperiment)
  )
  .post(
    "/experiments/:experimentId",
    experimentsUploader,
    asyncHandler(AdminControllers.updateExperiment)
  );

AdminRouter.get(
  "/participations",
  asyncHandler(AdminControllers.getParticipationsPage)
);

AdminRouter.get("/", redirectionGate("/admin/project-groups"));

AdminRouter.use(errorHandler);
export default AdminRouter;
