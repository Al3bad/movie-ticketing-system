import { Request, Response } from "express";

export const help = (req: Request, res: Response) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all customers",
      },
      {
        endpoint: `${req.baseUrl}/<customer-id>`,
        description: "Get customer info by id",
      },
    ],
  });
};
