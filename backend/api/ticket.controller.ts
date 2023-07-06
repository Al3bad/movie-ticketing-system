import { Request, Response } from "express";
import db from "backend/db/db";
import { httpStatus } from "server";

export const getAllTickets = (_: Request, res: Response) => {
  try {
    const tickets = db.getAllTickets();
    return res.status(httpStatus.OK).json(tickets);
  } catch (err: any) {
    return res
      .status(
        err.error.type === "DB"
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: err.error.msg } });
  }
};
