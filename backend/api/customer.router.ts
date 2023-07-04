import { initRouter } from "backend/utils";
// import * as controller from "./customer.controller";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/help",
    description: "Get list of endpoints available for /api/customer route",
  },
];

export default initRouter("/api/customer", routes);
