import express, { Router } from "express";
import { body, validationResult } from "express-validator";

// controllers
import * as MainController from "./controllers/main";

// restrictors
import * as AuthorizationGates from "./gates/authorization-gates";
import errorHandler from "./middlewares/error-handler";

const router: Router = express();

// Public Router
const PublicRouter: Router = express();

// Router for Authenticated (logged in) users
const AuthenticatedRouter: Router = express();
AuthenticatedRouter.use(
  AuthorizationGates.levelAuthorizationGate(0, "/main/login")
);

// Router for Researchers / Admin users
const PreviligedAccessRouter: Router = express();
PreviligedAccessRouter.use(
  AuthorizationGates.levelAuthorizationGate(100, "/main/login")
);

// Api Router
const ApiRouter: Router = express();

PublicRouter.get("/main/login", MainController.getLoginPage);
PublicRouter.get("/main/register", MainController.getRegisterPage);
PublicRouter.post(
  "/main/login",
  body("email")
    .exists()
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("이메일의 형식을 지켜주세요"),
  body("password").exists().withMessage("비밀번호를 입력해주세요"),
  MainController.loginUser
);
PublicRouter.post(
  "/main/register",
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

AuthenticatedRouter.get("/main", MainController.getProjectGroupsPage);
AuthenticatedRouter.get(
  "/main/project-groups/:projectGroupId",
  MainController.getProjectGroupPage
);

AuthenticatedRouter.get(
  "/main/projects/:projectId",
  MainController.getProjectPage
);
AuthenticatedRouter.get(
  "/main/experiments/:experimentId",
  MainController.getExperimentReadyPage
);
AuthenticatedRouter.get("/main/logout", MainController.logoutUser);

// Admin
router.use((req, res, next) => {
  console.log(req["session"]["user"]);
  next();
});

router.use(PublicRouter);
router.use(AuthenticatedRouter);
router.use(PreviligedAccessRouter);
router.use("/api", ApiRouter);

router.use(errorHandler);
export default router;
