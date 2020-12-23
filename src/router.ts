import express, { Router } from "express";

// controllers
import * as MainController from "./controllers/main";

// restrictors
import * as AuthorizationGates from "./middlewares/authorization-gates";

const router: Router = express();

router.get("/main/login", MainController.getLoginPage);
router.get("/main/register", MainController.getRegisterPage);
router.get(
  "/main",
  AuthorizationGates.levelAuthorizationGate(0, "/main/register"),
  MainController.getUnitProjectsPage
);

export default router;
