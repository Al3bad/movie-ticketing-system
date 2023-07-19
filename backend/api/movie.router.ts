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
  {
    method: "put",
    endpoint: "/:title",
    description: "Edit movie details (title/isReleased)",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "title of the movie",
        required: true,
      },
    ],
    json: [
      {
        name: "title",
        type: "string",
        description: "New title of the specified movie",
      },
      // {
      //   name: "seatAvailable",
      //   type: "integer",
      //   description: "New number of seats available",
      // },
      {
        name: "isReleased",
        type: "boolean",
        description: "Specifies whether the movie is released or not",
      },
    ],
    controller: controller.updateMovie,
  },
  {
    method: "post",
    endpoint: "/",
    description: "Create new movie",
    json: [
      {
        name: "title",
        type: "string",
        description: "New title of the specified movie",
      },
      {
        name: "seatAvailable",
        type: "integer",
        description: "Initial number of seats available",
      },
      {
        name: "isReleased",
        type: "boolean",
        description: "Specifies whether the movie is released or not",
      },
    ],
    controller: controller.createMovie,
  },
];

export default initRouter("/api/movie", routes);
