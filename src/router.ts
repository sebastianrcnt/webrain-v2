import express, { Router } from "express";
import { body, validationResult } from "express-validator";

// controllers
import * as MainController from "./controllers/main";

// restrictors
import * as AuthorizationGates from "./gates/authorization-gates";
import errorHandler from "./middlewares/error-handler";

const router: Router = express();

// Main
router.get("/main/login", MainController.getLoginPage);
router.get("/main/register", MainController.getRegisterPage);
router.get(
  "/main",
  // AuthorizationGates.levelAuthorizationGate(0, "/main/login"),
  MainController.getProjectGroupsPage
);
router.get(
  "/main/project-groups/:projectGroupId",
  MainController.getProjectGroupPage
);
router.get("/main/projects/:projectId", MainController.getProjectPage);
router.get(
  "/main/experiments/:experimentId",
  MainController.getExperimentReadyPage
);

router.post(
  "/main/login",
  body("email").exists().isEmail(),
  body("password").exists(),
  MainController.loginUser
);

// Admin

router.use(errorHandler);

export default router;
