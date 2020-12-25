import express, { Router } from "express";
import { body } from "express-validator";

// controllers
import * as AdminControllers from "../controllers/admin";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import errorHandler from "../middlewares/error-handler";

const ApiRouter: Router = express();

// Public Users
// TODO: restrict other users
ApiRouter.get("/", AdminControllers.getProjectGroupsPage);
ApiRouter.use(errorHandler);
export default ApiRouter;
