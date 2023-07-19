import { initRouter } from "backend/lib/utils";
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
      {
        name: "filter",
        type: "string",
        description: "filter customers by name",
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
    description: "Create new customer",
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
  {
    method: "put",
    endpoint: "/:email",
    description: "Edit customer info (email/name/discountRate/threshold)",
    parameters: [
      {
        name: "email",
        type: "string",
        description: "current email of the customer",
        required: true,
      },
    ],
    json: [
      {
        name: "email",
        type: "string",
        description: "new email of the customer",
      },
      // {
      //   name: "type",
      //   type: "string",
      //   description: "new type or current type of the customer",
      //   required: true,
      // },
      {
        name: "discountRate",
        type: "number",
        description:
          "new discount rate for flat/step reward customer (required when type = Flat | Step). If the type is Flat, the discount rate will be updated for all reward flat customers.",
      },
      {
        name: "threshold",
        type: "number",
        description:
          "new threshold for step reward customers (required when type = Step). The threshold will be updated for all reward step customers.",
      },
    ],
    controller: controller.updateCustomer,
  },
  {
    method: "put",
    endpoint: "/",
    description: "Update discountRate/threhold for reward flat/step customers",
    json: [
      {
        name: "type",
        type: "string",
        description: "type of the customers",
        required: true,
      },
      {
        name: "discountRate",
        type: "number",
        description:
          "new discount rate for flat/step reward customer (required when type = Flat). The discount rate will be updated for all reward flat customers.",
      },
      {
        name: "threshold",
        type: "number",
        description:
          "new threshold for step reward customers (required when type = Step). The threshold will be updated for all reward step customers.",
      },
    ],
    controller: controller.updateCustomers,
  },
  // {
  //   method: "delete",
  //   endpoint: "/:email",
  //   description: "Delete existing customer",
  //   parameters: [
  //     {
  //       name: "email",
  //       type: "string",
  //       description: "email of the customer",
  //       required: true,
  //     },
  //   ],
  //   controller: controller.deleteCustomer,
  // },
];

export default initRouter("/api/customer", routes);
