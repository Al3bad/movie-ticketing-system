import { Request, Response } from "express";
import * as query from "backend/dbQueries";
import { httpStatus } from "server";

export const getAllTickets = (_: Request, res: Response) => {
  const tickets = query.getAllTickets();
  if (tickets instanceof Array) {
    return res.status(httpStatus.OK).json(tickets);
  } else {
    return res
      .status(
        tickets.error.type === "DB"
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: tickets.error.msg } });
  }
};
