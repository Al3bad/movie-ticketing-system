import { Request, Response } from "express";
import * as z from "zod";
import db from "backend/db/db";
import { httpStatus } from "server";
import { NewTicketSchema } from "@/common/validations";
import { NotFoundResourceError } from "backend/lib/errors";

export const getAllTickets = (_: Request, res: Response) => {
  const tickets = db.getAllTickets();
  return res.status(httpStatus.OK).json(tickets);
};

export const getTicket = (req: Request, res: Response) => {
  const type = z.string().parse(req.params.type);
  const ticket = db.getTicket(type);
  if (!ticket)
    throw new NotFoundResourceError(
      `Ticket of type = '${req.params.ticket}' is not found!`,
      "ticket"
    );
  if ((ticket as Ticket).qty > 1) {
    (ticket as GroupTicket).components = db.getComponentTickets(type);
  }
  return res.status(httpStatus.OK).json(ticket);
};

export const createTicket = (req: Request, res: Response) => {
  const parsed = NewTicketSchema.parse(req.body);
  const ticket = db.insertTicket(parsed);
  return res.status(httpStatus.OK).json(ticket);
};
