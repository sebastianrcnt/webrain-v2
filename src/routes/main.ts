import express, { Router } from "express";
import { body } from "express-validator";

// controllers
import * as MainControllers from "../controllers/main";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import errorHandler from "../middlewares/error-handler";

const MainRouter: Router = express();

// Public Users
MainRouter.get("/login", MainControllers.getLoginPage)
  .get("/register", MainControllers.getRegisterPage)
  .post(
    "/login",
    body("email")
      .exists()
      .withMessage("이메일을 입력해주세요")
      .isEmail()
      .withMessage("이메일의 형식을 지켜주세요"),
    body("password").exists().withMessage("비밀번호를 입력해주세요"),
    MainControllers.loginUser
  )
  .post(
    "/register",
    body("email")
      .exists()
      .withMessage("이메일을 입력해주세요")
      .isEmail()
      .withMessage("이메일 형식을 지켜주세요"),
    body("password").exists().withMessage("비밀번호를 입력해주세요"),
    body("password2").exists().withMessage("비밀번호 확인을 입력해주세요"),
    body("name").exists().withMessage("이름을 입력해주세요"),
    body("phone").exists().withMessage("휴대폰 번호를 입력해주세요"),
    MainControllers.createUser
  );

// Only For Authenticated Users
MainRouter.use(AuthorizationGates.levelAuthorizationGate(0, "/main/login"))
  .get("/", MainControllers.getProjectGroupsPage)
  .get("/project-groups/:projectGroupId", MainControllers.getProjectGroupPage)
  .get("/projects/:projectId", MainControllers.getProjectPage)
  .get("/experiments/:experimentId", MainControllers.getExperimentReadyPage)
  .get("/logout", MainControllers.logoutUser);

MainRouter.use(errorHandler);
export default MainRouter;
