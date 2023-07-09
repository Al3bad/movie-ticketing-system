import { Request, Response } from "express";
import * as z from "zod";
import db from "backend/db/db";
import { httpStatus } from "server";

const GetMovieOptions = z.object({
  onlyReleased: z.boolean().optional().default(true),
  includeIsReleased: z.boolean().optional().default(false),
});

export const getAllMovies = (req: Request, res: Response) => {
  try {
    const options = GetMovieOptions.parse(req.query);
    const movies = db.getAllMovies(options);
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

export const getMovie = (req: Request, res: Response) => {
  try {
    const title = z.string().parse(req.params.title);
    const options = GetMovieOptions.parse(req.query);
    const movie = db.getMovieByTitle(title, options);
    if (!movie) {
      throw new Error("Movie not found!");
    }
    return res.status(httpStatus.OK).json(movie);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};
