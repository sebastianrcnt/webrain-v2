import express, { Router } from "express";
import { body } from "express-validator";

// controllers
import * as AdminControllers from "../controllers/admin";

// restrictors
import * as AuthorizationGates from "../gates/authorization-gates";
import errorHandler from "../middlewares/error-handler";

const AdminRouter: Router = express();

// Public Users
// TODO: restrict other users
AdminRouter.get("/", AdminControllers.getProjectGroupsPage)
AdminRouter.use(errorHandler);
export default AdminRouter;