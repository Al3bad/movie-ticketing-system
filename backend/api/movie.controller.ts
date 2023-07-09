import { Request, Response } from "express";
import * as z from "zod";
import db from "backend/db/db";
import { httpStatus } from "server";
import { GetMovieOptionsSchema } from "@/common/validations";
import { NotFoundResourceError } from "backend/lib/errors";

export const getAllMovies = (req: Request, res: Response) => {
  const options = GetMovieOptionsSchema.parse(req.query);
  const movies = db.getAllMovies(options);
  return res.status(httpStatus.OK).json(movies);
};

export const getMovie = (req: Request, res: Response) => {
  const title = z.string().parse(req.params.title);
  const options = GetMovieOptionsSchema.parse(req.query);
  const movie = db.getMovieByTitle(title, options);
  if (!movie) {
    throw new NotFoundResourceError(
      `Movie with title = '${title}' is not found!`,
      "movie"
    );
  }
  return res.status(httpStatus.OK).json(movie);
};
