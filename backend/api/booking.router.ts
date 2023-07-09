import { initRouter } from "backend/lib/utils";
import * as controller from "./booking.controller";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/",
    description: "Get all bookings",
    controller: controller.getAllBookings,
  },
  {
    method: "get",
    endpoint: "/:id",
    description: "Get booking by id",
    controller: controller.getBookingById,
  },
  {
    method: "post",
    endpoint: "/",
    description: "Create new booking",
    controller: controller.createBooking,
  },
];

export default initRouter("/api/booking", routes);
