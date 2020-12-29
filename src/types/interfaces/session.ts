import * as Express from "express";
import { IUser } from "../../database";

export interface IDestroySessionFunction {
  (error: Error): any;
}

export interface ISession {
  user: IUser;
  destroy: (callback: IDestroySessionFunction) => any;
}

export interface RequestWithSession extends Express.Request {
  session: ISession;
}

export interface ResponseWithSession extends Express.Response {}
