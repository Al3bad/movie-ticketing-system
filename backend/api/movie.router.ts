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
];

export default initRouter("/api/movie", routes);
