import { NewBookingSchema } from "@/common/validations";
// import { insertBooking } from "backend/db/dbQueries";
import db from "backend/db/db";
import { NotFoundResourceError } from "backend/lib/exceptions";
import { formatBooking, formatBookings } from "backend/lib/utils";
import { Request, Response } from "express";
import { httpStatus } from "server";
import z from "zod";

export const createBooking = (req: Request, res: Response) => {
  const parsed = NewBookingSchema.parse(req.body);
  const booking = db.insertBooking(parsed);
  // FIXME: handle typing
  return res.status(httpStatus.CREATED).json(formatBooking(booking as any));
};

export const getAllBookings = (_: Request, res: Response) => {
  const bookings = db.getAllBooking();
  return res.status(httpStatus.OK).json(formatBookings(bookings));
};

export const getBookingById = (req: Request, res: Response) => {
  const id = z.coerce
    .number()
    .positive()
    .int()
    .or(z.bigint())
    .parse(req.params.id);

  const booking = db.getBookingById(id);
  if (!booking || booking.length === 0) {
    throw new NotFoundResourceError(
      `Booking with ID = ${id} is not found!`,
      "booking"
    );
  }
  // FIXME: handle typing
  return res.status(httpStatus.OK).json(formatBooking(booking as any));
};

export const exportRecords = (_: Request, res: Response) => {
  // TODO:
  res.end("TODO");
};
