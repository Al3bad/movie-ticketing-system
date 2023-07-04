import { NewBookingSchema } from "@/common/validations";
import { insertBooking } from "backend/dbQueries";
import { Request, Response } from "express";
import { httpStatus } from "server";

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
            ? httpStatus.BAD_REQUEST
            : httpStatus.INTERNAL_SERVER_ERROR
        )
        .json({ error: { msg: booking.error.msg } });
    } else {
      return res.status(httpStatus.CREATED).json(booking);
    }
  } else {
    // if there is a problem -> res with an error
    return res.status(httpStatus.BAD_REQUEST).json({
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
