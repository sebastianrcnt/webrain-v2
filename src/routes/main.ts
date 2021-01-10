import express, { Router } from "express";
import { body } from "express-validator";
import fs from "fs"
import path from "path";

// controllers
import * as MainControllers from "../controllers/main";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import asyncHandler from "../utils/async-handler";

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
    asyncHandler(MainControllers.loginUser)
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
    asyncHandler(MainControllers.createUser)
  );

// Only For Authenticated Users
MainRouter.use(AuthorizationGates.levelAuthorizationGate(0, "/main/login"))
  .get("/project-groups/", asyncHandler(MainControllers.getProjectGroupsPage))
  .get(
    "/project-groups/:projectGroupId",
    asyncHandler(MainControllers.getProjectGroupPage)
  )
  .get("/projects/:projectId", asyncHandler(MainControllers.getProjectPage))
  .get(
    "/experiments/:experimentId",
    asyncHandler(MainControllers.getExperimentReadyPage)
  )
  .get("/logout", asyncHandler(MainControllers.logoutUser));

MainRouter.get("/", (req, res) => {
  let html = ""
  const homeHtmlPath = path.resolve("buffer/home.html");
  const homeDefaultHtmlPath = path.resolve("buffer/home.default.html");
  if (fs.existsSync(homeHtmlPath)) {
    html = fs.readFileSync(homeHtmlPath, { encoding: "utf-8" });
  } else {
    html = fs.readFileSync(homeDefaultHtmlPath, { encoding: "utf-8" });
  }
  res.render("main/pages/index", { html });
})

export default MainRouter;
