import path from "node:path";
import SQLite3, { Database } from "better-sqlite3";

const dbDir = path.join(__dirname, process.env.DB_NAME || "database.db");
const db: Database = new SQLite3(dbDir);

export default db;
