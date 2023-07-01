import "dotenv/config";
import express from "express";
import { cors } from "./backend/middlewares";
import api from "./backend/api";
import { initDB } from "./backend/dbQueries";

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
  await initDB();
  console.log(`Server is running on port ${PORT}`);
});
