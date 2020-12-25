import express, { Router } from "express";
import AdminRouter from "./admin";
import MainRouter from "./main";

const IndexRouter: express.Router = express();

IndexRouter.use("/main", MainRouter);
IndexRouter.use("/admin", AdminRouter);
// IndexRouter.use("/api", ApiRouter)

export default IndexRouter;
