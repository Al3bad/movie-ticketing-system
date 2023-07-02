import { constants } from "node:http2";
import { NewBookingSchema } from "@/common/validations";
import { insertBooking } from "backend/dbQueries";
import { Request, Response } from "express";

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = constants;

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
  const result = NewBookingSchema.safeParse(req.body);

  if (result.success) {
    // call function to insert data in db
    const booking = insertBooking(result.data);
    if (booking.error) {
      return res
        .status(
          booking.error.type === "DB"
            ? HTTP_STATUS_BAD_REQUEST
            : HTTP_STATUS_INTERNAL_SERVER_ERROR
        )
        .json({ error: { msg: booking.error.msg } });
    } else {
      return res.status(HTTP_STATUS_CREATED).json(booking);
    }
  } else {
    // if there is a problem -> res with an error
    return res.status(HTTP_STATUS_BAD_REQUEST).json({
      error: {
        msg: "Invalid 'new booking' information",
        details: result.error.issues,
      },
    });
  }
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
