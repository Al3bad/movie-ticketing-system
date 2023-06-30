import { Router } from "express";
import routerCustomer from "./router.customer";
import routerMovie from "./router.movie";
import routerTicket from "./router.ticket";
import routerBooking from "./router.booking";
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
