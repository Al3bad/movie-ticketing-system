import { NewBookingSchema } from "@/common/validations";
// import { insertBooking } from "backend/db/dbQueries";
import db from "backend/db/db";
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

const formatBookings = (bookings: any) => {
  return [...new Set(bookings.map((b: any) => b.id))].map((id) => {
    return formatBooking(
      bookings.filter((currBooking: any) => currBooking.id === id)
    );
  });
};

const formatBooking = (
  booking: {
    id: number;
    email: string;
    name: string;
    type: CustomerType;
    discountRate?: number | null;
    threshold?: number | null;
    title: string;
    ticketType: string;
    ticketPrice: number;
    qty: number;
    component: string | null;
    componentTicketQty: number | null;
  }[]
) => {
  const { id, email, name, type, title, discountRate, threshold } = booking[0];
  const formattedBooking: {
    id: number;
    customer: Modify<
      NormalCustomer,
      { type: CustomerType; discountRate?: number; threshold?: number }
    >;
    title: string;
    tickets: Ticket[];
  } = {
    id: id,
    customer: {
      email: email,
      name: name,
      type: type,
    },
    title: title,
    tickets: [],
  };
  if (discountRate !== null && type !== "Normal") {
    formattedBooking.customer.discountRate = discountRate;
  }
  if (threshold !== null && type === "Step") {
    formattedBooking.customer.threshold = threshold;
  }

  // Group tickets
  const groupTickets: Array<{
    type: string;
    price: number;
    qty: number;
    components: Omit<TicketComponent, "component">[];
  }> = [];
  booking
    .filter((t) => t.component !== null && t.componentTicketQty !== null)
    .forEach((t) => {
      const groupTicketIdx = groupTickets.findIndex(
        (processingTicket) => processingTicket.type === t.ticketType
      );
      if (groupTicketIdx === -1 && t.component && t.componentTicketQty) {
        groupTickets.push({
          type: t.ticketType,
          price: t.ticketPrice,
          qty: t.qty,
          components: [{ type: t.component, qty: t.componentTicketQty }],
        });
      } else if (groupTicketIdx !== -1 && t.component && t.componentTicketQty) {
        groupTickets[groupTicketIdx].components.push({
          type: t.component,
          qty: t.componentTicketQty,
        });
      }
    });

  // Signal tickets
  const singleTickets = booking
    .filter((t) => t.component === null)
    .map((t) => {
      return { type: t.ticketType, price: t.ticketPrice, qty: t.qty };
    });

  formattedBooking.tickets.push(...singleTickets, ...groupTickets);

  return formattedBooking;
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
    if (!booking) {
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
