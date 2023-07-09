import * as controller from "./movie.controller";
import { initRouter } from "backend/lib/utils";

// ==============================================
// ==> Define Routes
// ==============================================
const routes: Backend.Route[] = [
  {
    method: "get",
    endpoint: "/",
    description: "Get all released movies",
    query: [
      {
        name: "onlyReleased",
        type: "boolean",
        description: "Get all or only released movies",
        default: true,
      },
      {
        name: "includeIsReleased",
        type: "boolean",
        description:
          "Include/exclude 'isReleased' property from each movie object",
        default: false,
      },
    ],
    controller: controller.getAllMovies,
  },
  {
    method: "get",
    endpoint: "/:title",
    description: "Get movie details by its title",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "title of the movie",
        required: true,
      },
    ],
    query: [
      {
        name: "onlyReleased",
        type: "boolean",
        description: "Get all or only released movies",
        default: true,
      },
      {
        name: "includeIsReleased",
        type: "boolean",
        description:
          "Include/exclude 'isReleased' property from each movie object",
        default: false,
      },
    ],
    controller: controller.getMovie,
  },
];

export default initRouter("/api/movie", routes);
