import express, { Router } from "express";

// controllers
import * as MainController from "./controllers/main";

// restrictors
import * as AuthorizationGates from "./gates/authorization-gates";

const router: Router = express();

router.get("/main/login", MainController.getLoginPage);
router.get("/main/register", MainController.getRegisterPage);
router.get(
  "/main",
  // AuthorizationGates.levelAuthorizationGate(0, "/main/login"),
  MainController.getProjectGroupsPage
);

export default router;
