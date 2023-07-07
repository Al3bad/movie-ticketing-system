import { initRouter } from "backend/utils";
import * as controller from "./ticket.controller";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/",
    description: "Get all available ticket types",
    controller: controller.getAllTickets,
  },
];

export default initRouter("/api/ticket", routes);
