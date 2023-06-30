import { Request, Response } from "express";

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
