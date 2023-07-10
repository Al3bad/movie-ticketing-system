import { initRouter } from "backend/lib/utils";
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
  {
    method: "post",
    endpoint: "/",
    description: "Create new ticket type",
    json: [
      {
        name: "type",
        type: "string",
        description: "Ticket type name",
        required: true,
      },
      {
        name: "price",
        type: "number",
        description: "Price of the ticket type (only for single tickets)",
      },
      {
        name: "components",
        type: "array",
        description:
          "Components of the a group tickets { type: string, price: number, qty: integer }",
      },
    ],
    controller: controller.createTicket,
  },
];

export default initRouter("/api/ticket", routes);
