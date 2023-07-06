import { Request, Response } from "express";
// import * as query from "backend/db/dbQueries";
import db from "backend/db/db";
import { httpStatus } from "server";

export const getAllMovies = (_: Request, res: Response) => {
  try {
    const movies = db.getAllMovies({
      onlyReleased: true,
      includeIsReleased: false,
    });
    return res.status(httpStatus.OK).json(movies);
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
