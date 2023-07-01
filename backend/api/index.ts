import { Router } from "express";
import routerCustomer from "./customer.router";
import routerMovie from "./movie.router";
import routerTicket from "./ticket.router";
import routerBooking from "./booking.router";
const api = Router();

// /api
api.get("/", (_, res) => {
  res.end("The API is up and running :)");
});

// Routers
api.use("/customer", routerCustomer);
api.use("/movie", routerMovie);
api.use("/ticket", routerTicket);
api.use("/booking", routerBooking);

export default api;
