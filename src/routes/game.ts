import express, { Router } from "express";
import { body, query, param } from "express-validator";

// controllers
import * as GameControllers from "../controllers/game";
import { levelAuthorizationGate } from "../gates/authorization-gates";

// restrictors
import { validationErrorHandlerASync } from "../middlewares/validation-error-handler";
import asyncHandler from "../utils/async-handler";

const GameRouter: Router = express();
GameRouter.use(levelAuthorizationGate(0, "/main/"));
GameRouter.get(
  "/new",
  query("experimentId"),
  asyncHandler(GameControllers.getGamePage)
)
  .get(
    "/instructions",
    query("experimentId"),
    asyncHandler(GameControllers.getGameInstructions)
  )
  .post(
    "/submit",
    query("participationId"),
    asyncHandler(GameControllers.submit)
  );

export default GameRouter;
