import "dotenv/config";
import { constants } from "node:http2";
import express from "express";
import { cors } from "./backend/lib/middlewares";
import api from "./backend/api";

export const httpStatus = {
  // 2xx
  OK: constants.HTTP_STATUS_OK,
  CREATED: constants.HTTP_STATUS_CREATED,
  NO_CONTENT: constants.HTTP_STATUS_NO_CONTENT,
  // 4xx
  NOT_FOUND: constants.HTTP_STATUS_NOT_FOUND,
  BAD_REQUEST: constants.HTTP_STATUS_BAD_REQUEST,
  // 5xx
  INTERNAL_SERVER_ERROR: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
};

// ==============================================
// ==> Prepare App
// ==============================================
const PORT = process.env.PORT || 3030;
const app = express();
app.disable("x-powered-by");

// ==============================================
// ==> Middlewares
// ==============================================
// parse json and urlencoded bodies in the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors);

// ==============================================
// ==> API Routes
// ==============================================
app.options("*", (_, res) => {
  res.header("Allow", "OPTIONS, GET, POST, PUT, DELETE");
  res.end();
});
app.use("/api", api);

// ==============================================
// ==> Frontend Routes (production)
// ==============================================
app.use(express.static(`${__dirname}/static/dist`));

app.get("/*", (_, res) => {
  res.sendFile(`${__dirname}/static/dist/index.html`);
});

// ==============================================
// ==> Start Listening
// ==============================================
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
