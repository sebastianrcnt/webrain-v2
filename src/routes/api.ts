import express, { Router } from "express";
import { body } from "express-validator";

// controllers
import * as MainController from "../controllers/main";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import errorHandler from "../middlewares/error-handler";

const ApiRouter: Router = express();

// Public Router
const PublicRouter: Router = express();

// Router for Authenticated (logged in) users
const AuthenticatedRouter: Router = express();
AuthenticatedRouter.use(AuthorizationGates.levelAuthorizationGate(0, "/login"));

// Router for Researchers / Admin users
const PreviligedAccessRouter: Router = express();
PreviligedAccessRouter.use(
  AuthorizationGates.levelAuthorizationGate(100, "/login")
);

PublicRouter.get("/login", MainController.getLoginPage);
PublicRouter.get("/register", MainController.getRegisterPage);
PublicRouter.post(
  "/login",
  body("email")
    .exists()
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("이메일의 형식을 지켜주세요"),
  body("password").exists().withMessage("비밀번호를 입력해주세요"),
  MainController.loginUser
);
PublicRouter.post(
  "/register",
  body("email")
    .exists()
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("이메일 형식을 지켜주세요"),
  body("password").exists().withMessage("비밀번호를 입력해주세요"),
  body("password2").exists().withMessage("비밀번호를 입력해주세요"),
  body("name").exists().withMessage("비밀번호를 입력해주세요"),
  body("phone").exists().withMessage("비밀번호를 입력해주세요"),
  MainController.createUser
);

AuthenticatedRouter.get("", MainController.getProjectGroupsPage);
AuthenticatedRouter.get(
  "/project-groups/:projectGroupId",
  MainController.getProjectGroupPage
);

AuthenticatedRouter.get("/projects/:projectId", MainController.getProjectPage);
AuthenticatedRouter.get(
  "/experiments/:experimentId",
  MainController.getExperimentReadyPage
);
AuthenticatedRouter.get("/logout", MainController.logoutUser);

// Admin
ApiRouter.use((req, res, next) => {
  console.log(req["session"]["user"]);
  next();
});

ApiRouter.use(PublicRouter);
ApiRouter.use(AuthenticatedRouter);
ApiRouter.use(PreviligedAccessRouter);

ApiRouter.use(errorHandler);
export default ApiRouter;
