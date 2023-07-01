import fs from "node:fs/promises";
import path from "node:path";
import db from "./db";

// ==============================================
// ==> Init DB
// ==============================================
export const initDB = async () => {
  try {
    const createTablesQueries = await fs.readFile(
      path.join(__dirname, "sqlite", "createTables.sql"),
      "utf8"
    );
    db.exec(createTablesQueries);
  } catch (err: unknown) {
    console.log("[ERROR] Couldn't read the sql file to init the DB");
    process.exit(1);
  }
};
