import { initRouter } from "backend/utils";
import * as controller from "./customer.controller";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/",
    description: "Get all customers",
    query: [
      { name: "page", type: "integer", description: "page number" },
      {
        name: "limit",
        type: "integer",
        description: "number of customers in the response",
      },
    ],
    controller: controller.getCustomers,
  },
  {
    method: "get",
    endpoint: "/:email",
    description: "Get all customers",
    parameters: [
      {
        name: "email",
        type: "string",
        description: "email of the customer",
        required: true,
      },
    ],
    controller: controller.getCustomerByEmail,
  },
];

export default initRouter("/api/customer", routes);
