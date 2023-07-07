import { initRouter } from "backend/utils";
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
  {
    method: "get",
    endpoint: "/help",
    description: "Get list of endpoints available for /api/booking route",
  },
];

export default initRouter("/api/booking", routes);
