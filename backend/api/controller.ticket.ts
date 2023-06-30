import { Request, Response } from "express";

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
