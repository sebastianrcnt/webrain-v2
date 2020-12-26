import express, { Router } from "express";
import { body, param } from "express-validator";

// controllers
import * as AdminControllers from "../controllers/admin";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import { redirectionGate } from "../gates/redirection-gates";
import errorHandler from "../middlewares/error-handler";
import asyncHandler from "../utils/async-handler";

const AdminRouter: Router = express();

// Public Users
// TODO: restrict other users
// AdminRouter.use(AuthorizationGates.levelAuthorizationGate(100, "/main/login"))
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
  .post("/project-groups", asyncHandler(AdminControllers.createProjectGroup))
  .post(
    "/project-groups/:projectGroupId",
    asyncHandler(AdminControllers.updateProjectGroup)
  )
  .delete(
    "/project-groups/:projectGroupId",
    asyncHandler(AdminControllers.deleteProjectGroup)
  );

AdminRouter.get("/projects", asyncHandler(AdminControllers.getProjectPage)).get(
  "/projects/new",
  asyncHandler(AdminControllers.getNewProjectPage)
);

AdminRouter.get("/", redirectionGate("/admin/project-groups"));

AdminRouter.use(errorHandler);
export default AdminRouter;
