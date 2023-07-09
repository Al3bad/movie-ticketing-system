import { Request, Response } from "express";
import db from "backend/db/db";
import { httpStatus } from "server";

export const getAllTickets = (_: Request, res: Response) => {
  const tickets = db.getAllTickets();
  return res.status(httpStatus.OK).json(tickets);
};
