import * as Express from "express";

export interface RequestWithSession extends Express.Request {
  session: any;
}

export interface ResponseWithSession extends Express.Response {

}