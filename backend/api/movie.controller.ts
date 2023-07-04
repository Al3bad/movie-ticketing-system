import { Request, Response } from "express";
import * as query from "backend/dbQueries";
import { httpStatus } from "server";

export const getAllMovies = (_: Request, res: Response) => {
  const movies = query.getAllMovies();
  if (movies instanceof Array) {
    return res.status(httpStatus.OK).json(movies);
  } else {
    return res
      .status(
        movies.error.type === "DB"
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: movies.error.msg } });
  }
};
