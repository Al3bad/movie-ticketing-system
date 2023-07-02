import fs from "node:fs/promises";
import path from "node:path";
import db from "./db";
import { SqliteError } from "better-sqlite3";

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

// ==============================================
// ==> Booking Queries
// ==============================================
export const insertBooking = (newBooking: NewBooking) => {
  const { customer, movie, tickets } = newBooking;

  // Create new customer, if not exists
  try {
    db.prepare("BEGIN").run();
    db.prepare("INSERT INTO customer(email, name, type) VALUES (?, ?, ?)").run(
      customer.email,
      customer.name,
      customer.type
    );
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
        console.log(
          "Customer exist in the system. Skipping creating new customer"
        );
      }
    } else if (err instanceof Error) {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "DB",
          msg: err.message,
        },
      };
    } else {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "UNKNOWN",
          msg: `Error occured in ${__filename}`,
        },
      };
    }
  }

  // Insert into booking table
  const booking: { id?: number | bigint } = {};
  try {
    const info = db
      .prepare("INSERT INTO booking(customerEmail, movieTitle) VALUES (?, ?)")
      .run(customer.email, movie);
    booking.id = info.lastInsertRowid;
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        db.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      }
    } else if (err instanceof Error) {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "DB",
          msg: err.message,
        },
      };
    } else {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "UNKNOWN",
          msg: `Error occured in ${__filename}`,
        },
      };
    }
  }

  // Update movies
  try {
    const totalTickets = Object.entries(tickets).reduce(
      (total, pair) => total + pair[1].qty,
      0
    );

    db.prepare(
      "UPDATE movie SET seatAvailable = (SELECT seatAvailable FROM movie WHERE title = ?) - ? WHERE title = ?"
    ).run(movie, totalTickets, movie);
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      if (err.code === "SQLITE_CONSTRAINT_CHECK") {
        db.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: "The number of requested seats exceeds the seats available!",
          },
        };
      }
    } else if (err instanceof Error) {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "DB",
          msg: err.message,
        },
      };
    } else {
      db.prepare("ROLLBACK").run();
      return {
        error: {
          type: "UNKNOWN",
          msg: `Error occured in ${__filename}`,
        },
      };
    }
  }

  // Insert puchased tickets into "purchased ticket" table
  for (const { type, qty } of tickets) {
    try {
      db.prepare(
        "INSERT INTO purchasedTicket (bookingId, ticketType, qty) VALUES (?,?,?)"
      ).run(booking.id, type, qty);
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
          db.prepare("ROLLBACK").run();
          return {
            error: {
              type: "DB",
              msg: err.message,
            },
          };
        }
      } else if (err instanceof Error) {
        db.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      } else {
        db.prepare("ROLLBACK").run();
        return {
          error: {
            type: "UNKNOWN",
            msg: `Error occured in ${__filename}`,
          },
        };
      }
    }
  }
  db.prepare("COMMIT").run();
  return {
    id: booking.id,
    ...newBooking,
  };
};
