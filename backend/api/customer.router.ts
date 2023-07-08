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
  {
    method: "post",
    endpoint: "/",
    description: "Create new customers",
    json: [
      {
        name: "email",
        type: "string",
        description: "email of the customer",
        required: true,
      },
      {
        name: "name",
        type: "string",
        description: "name of the customer",
        required: true,
      },
      {
        name: "type",
        type: "string",
        description: "type of the customer",
        required: true,
      },
      {
        name: "discountRate",
        type: "number",
        description:
          "discount rate for flat/step reward customer (required when type = Normal | Step)",
      },
      {
        name: "threshold",
        type: "number",
        description:
          "threshold for step reward customers (required when type = Step)",
      },
    ],
    controller: controller.createCustomer,
  },
];

export default initRouter("/api/customer", routes);
