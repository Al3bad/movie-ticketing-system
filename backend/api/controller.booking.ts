import { Request, Response } from "express";

export const help = (req: Request, res: Response) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all bookings",
      },
      {
        endpoint: `${req.baseUrl}/<booking-id>`,
        description: "Get booking info by id",
      },
    ],
  });
};
