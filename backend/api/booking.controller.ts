import { NewBookingSchema } from "@/common/validations";
// import { insertBooking } from "backend/db/dbQueries";
import db from "backend/db/db";
import { formatBooking, formatBookings } from "backend/utils";
import { Request, Response } from "express";
import { httpStatus } from "server";
import zod from "zod";

export const createBooking = (req: Request, res: Response) => {
  // validate data received from frontend
  const result = NewBookingSchema.safeParse(req.body);

  if (result.success) {
    try {
      // call function to insert data in db
      const booking = db.insertBooking(result.data);
      return res.status(httpStatus.CREATED).json(formatBooking(booking as any));
    } catch (err: any) {
      return res
        .status(
          err.error.type === "DB"
            ? httpStatus.BAD_REQUEST
            : httpStatus.INTERNAL_SERVER_ERROR
        )
        .json({ error: { msg: err.error.msg } });
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

export const getAllBookings = (_: Request, res: Response) => {
  try {
    const bookings = db.getAllBooking();
    console.log();
    return res.status(httpStatus.OK).json(formatBookings(bookings));
  } catch (err: any) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};

export const getBookingById = (req: Request, res: Response) => {
  const { id } = req.params;

  const idNumber = zod.coerce.number().safeParse(id);

  if (!idNumber.success) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: { msg: "Invalid booking ID!" } });
  }

  try {
    const booking = db.getBookingById(idNumber.data);
    if (!booking || booking.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({});
    }
    return res.status(httpStatus.OK).json(formatBooking(booking as any));
  } catch (err: any) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};

export const exportRecords = (_: Request, res: Response) => {
  // TODO:
  res.end("TODO");
};
