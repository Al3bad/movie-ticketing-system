import { constants } from "node:http2";
import { Request, Response } from "express";

import * as query from "backend/dbQueries";

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = constants;

export const help = (req: Request, res: Response) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all tickets",
      },
      {
        endpoint: `${req.baseUrl}/<ticket-id>`,
        description: "Get ticket info by id",
      },
    ],
  });
};

export const getAllTickets = (_: Request, res: Response) => {
  const tickets = query.getAllTickets();
  if (tickets instanceof Array) {
    return res.status(HTTP_STATUS_OK).json(tickets);
  } else {
    return res
      .status(
        tickets.error.type === "DB"
          ? HTTP_STATUS_BAD_REQUEST
          : HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: tickets.error.msg } });
  }
};
