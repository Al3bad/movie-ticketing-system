import { Router } from "express";
import { httpStatus } from "server";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";

export const initRouter = (base: string, routes: Backend.Route[]) => {
  const re = new RegExp("^/\\S+(?<!/)$");
  if (!re.test(base)) {
    console.log(`Invalid base API url! (${base})`);
    process.exit(1);
  }
  // ==============================================
  // ==> Mount Routes
  // ==============================================
  const router = Router();
  routes.forEach((route) => {
    const { method, endpoint, controller } = route;
    if (controller) router[method](endpoint, controller);
  });

  // ==============================================
  // ==> Mount Help Route
  // ==============================================
  const helpObj = routes.map((route) => {
    route.endpoint = `${base}${route.endpoint}`;
    delete route.controller;
    return route;
  });

  //
  // router.get("/help", (_, res) => {
  //   res.json({
  //     routes: helpObj,
  //   });
  // });

  // ==============================================
  // ==> Not Found route handler
  // ==============================================
  router.use((_, res) => {
    res.status(httpStatus.NOT_FOUND);
    res.json({
      routes: helpObj,
    });
  });
  return router;
};

// ==============================================
// ==> Booking formatters
// ==============================================
// TODO: type this
export const formatBookings = (bookings: any) => {
  if (bookings.length === 0) return [];
  return [...new Set(bookings.map((b: any) => b.id))].map((id) => {
    return formatBooking(
      bookings.filter((currBooking: any) => currBooking.id === id)
    );
  });
};

// TODO: type this & improve error handling
export const formatBooking = (
  booking: {
    id: number;
    email: string;
    name: string;
    type: CustomerType;
    discountRate: number;
    threshold?: number | null;
    title: string;
    ticketType: string;
    ticketPrice: number;
    qty: number;
    component: string | null;
    componentTicketQty: number | null;
  }[]
) => {
  if (booking.length === 0) return [];
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
      discountRate: discountRate,
    },
    title: title,
    tickets: [],
  };
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

// ==============================================
// ==> Zod -> TS
// ==============================================

export const genTsFromZod = (zodSchemas: any) => {
  for (const key in zodSchemas) {
    const schema = zodSchemas[key];
    // console.log(`zodToTs(${zodSchemas[key]}, ${key.slice(0, -6)})`);
    const identifier = key.slice(0, -6);
    const { node } = zodToTs(schema, identifier);
    const typeAlias = createTypeAlias(node, identifier);
    // TODO: Replace below with write to file logic
    console.log(identifier);
    console.log(printNode(typeAlias));
  }
};
