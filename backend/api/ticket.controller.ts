import { Request, Response } from "express";
import db from "backend/db/db";
import { httpStatus } from "server";
import { NewTicketSchema } from "@/common/validations";

export const getAllTickets = (_: Request, res: Response) => {
  const tickets = db.getAllTickets();
  return res.status(httpStatus.OK).json(tickets);
};

export const createTicket = (req: Request, res: Response) => {
  const parsed = NewTicketSchema.parse(req.body);
  const ticket = db.insertTicket(parsed);
  return res.status(httpStatus.OK).json(ticket);
};
