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
        description: "Get all movies",
      },
      {
        endpoint: `${req.baseUrl}/<movie-id>`,
        description: "Get movie info by id",
      },
    ],
  });
};

export const getAllMovies = (_: Request, res: Response) => {
  const movies = query.getAllMovies();
  if (movies instanceof Array) {
    return res.status(HTTP_STATUS_OK).json(movies);
  } else {
    return res
      .status(
        movies.error.type === "DB"
          ? HTTP_STATUS_BAD_REQUEST
          : HTTP_STATUS_INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: movies.error.msg } });
  }
};
