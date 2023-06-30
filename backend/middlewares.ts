import { Request, Response, NextFunction } from "express";

export const cors = (_: Request, res: Response, next: NextFunction) => {
  // reference: https://stackoverflow.com/a/7069902
  // Allow frontend to use the API in the dev environment
  if (process.env.NODE_ENV !== "production") {
    res.header("Access-Control-Allow-Origin", [
      process.env.DOMAIN_URL || "http://localhost:5173",
    ]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ]);
    res.header("Access-Control-Allow-Headers", ["Content-Type"]);
  }
  next();
};
