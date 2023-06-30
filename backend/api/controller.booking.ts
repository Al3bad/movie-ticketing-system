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

export const createBooking = (req: Request, res: Response) => {
  // validate data received from frontend

  // call function to insert data in db

  // if there is a problem -> res with an error

  // otherwise -> res with OK status
  res.end("IN PROGRESS");
};

export const getAllBookings = (req: Request, res: Response) => {
  // TODO:
  res.end("TODO");
};

export const getBookingById = (req: Request, res: Response) => {
  // TODO:
  res.end("TODO");
};

export const exportRecords = (req: Request, res: Response) => {
  // TODO:
  res.end("TODO");
};
