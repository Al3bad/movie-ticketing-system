import * as controller from "./movie.controller";
import { initRouter } from "backend/utils";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/",
    description: "Get all released movies",
    controller: controller.getAllMovies,
  },
  {
    method: "get",
    endpoint: "/help",
    description: "Get list of endpoints available for /api/movie route",
  },
];

export default initRouter("/api/movie", routes);
