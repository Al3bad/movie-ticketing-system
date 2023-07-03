import fs from "node:fs/promises";
import path from "node:path";
import db from "./db";
import { SqliteError } from "better-sqlite3";

// ==============================================
// ==> Error Handling
// ==============================================
const dbErrorHandler = (err: unknown) => {
  if (err instanceof SqliteError) {
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      return {
        type: "DB",
        msg: err.message,
      };
    } else if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return {
        type: "DB",
        msg: err.message,
      };
    } else if (err.code === "SQLITE_CONSTRAINT_CHECK") {
      return {
        type: "DB",
        msg: "The number of requested seats exceeds the seats available!",
      };
    } else {
      return {
        type: "DB_" + err.code,
        msg: err.message,
      };
    }
  } else {
    console.log(
      `[ERROR] ${(err as Error).message}.\n\nOccured in filename: ${__filename}`
    );
    return {
      type: "UNKNOWN",
      msg: "Server error. Please contact the developer!",
    };
  }
};

// ==============================================
// ==> Init DB
// ==============================================
export const initDB = async () => {
  try {
    const createTablesQueries = await fs.readFile(
      path.join(__dirname, "sqlite", "createTables.sql"),
      "utf8"
    );
    db.connection.exec(createTablesQueries);
  } catch (err: unknown) {
    console.log("[ERROR] Couldn't read the sql file to init the DB");
    process.exit(1);
  }
};

// ==============================================
// ==> Movie Queries
// ==============================================
export const insertMovie = (newMovie: NewMovie) => {
  const { title, seatAvailable, isReleased } = newMovie;

  try {
    const stmt = db.connection.prepare(
      "INSERT INTO movie(title, seatAvailable, isReleased) VALUES (?,?,?)"
    );
    stmt.run(title, seatAvailable, isReleased ? 1 : 0);
    return newMovie;
  } catch (err: unknown) {
    return { error: dbErrorHandler(err) };
  }
};

export const getAllMovies = () => {
  type EMoive = Omit<Movie, "isReleased">;
  try {
    const stmt = db.connection.prepare(
      "SELECT title, seatAvailable FROM movie WHERE isReleased = true"
    );
    const data = stmt.all() as EMoive[];
    return data;
  } catch (err: unknown) {
    return { error: dbErrorHandler(err) };
  }
};

// ==============================================
// ==> Ticket Queries
// ==============================================
// TODO: type it properly
export const insertTicket = (newTicket: any) => {
  const { type, component, price, qty } = newTicket;

  try {
    const stmt = db.connection.prepare(
      "INSERT INTO ticket(type, component, price, qty) VALUES (?,?,?,?)"
    );
    stmt.run(type, component, price, qty);
    return newTicket;
  } catch (err: unknown) {
    return { error: dbErrorHandler(err) };
  }
};

// ==============================================
// ==> Customer Queries
// ==============================================
// TODO: type it properly
export const insertCustomer = (newCustomer: any) => {
  const { email, name, type, discoundRate, threshold } = newCustomer;

  try {
    const stmt = db.connection.prepare(
      "INSERT INTO customer(email, name, type, discountRate, threshold) VALUES (?,?,?,?,?)"
    );
    stmt.run(email, name, type, discoundRate, threshold);
    return newCustomer;
  } catch (err: unknown) {
    return { error: dbErrorHandler(err) };
  }
};

// ==============================================
// ==> Booking Queries
// ==============================================
export const insertBooking = (newBooking: NewBooking) => {
  const { customer, movie, tickets } = newBooking;

  // Create new customer, if not exists
  try {
    db.connection.prepare("BEGIN").run();
    db.connection
      .prepare("INSERT INTO customer(email, name, type) VALUES (?, ?, ?)")
      .run(customer.email, customer.name, customer.type);
  } catch (err: unknown) {
    const error = dbErrorHandler(err);
    if (
      err instanceof SqliteError &&
      err.code === "SQLITE_CONSTRAINT_PRIMARYKEY"
    ) {
      console.log("Customer already exists!");
    } else {
      db.connection.prepare("ROLLBACK").run();
      return { error: error };
    }
  }

  // Insert into booking table
  const booking: { id?: number | bigint } = {};
  try {
    const info = db.connection
      .prepare("INSERT INTO booking(customerEmail, movieTitle) VALUES (?, ?)")
      .run(customer.email, movie);
    booking.id = info.lastInsertRowid;
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        db.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      }
    } else if (err instanceof Error) {
      db.connection.prepare("ROLLBACK").run();
      return {
        error: {
          type: "DB",
          msg: err.message,
        },
      };
    } else {
      db.connection.prepare("ROLLBACK").run();
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

    db.connection
      .prepare(
        "UPDATE movie SET seatAvailable = (SELECT seatAvailable FROM movie WHERE title = ?) - ? WHERE title = ?"
      )
      .run(movie, totalTickets, movie);
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      if (err.code === "SQLITE_CONSTRAINT_CHECK") {
        db.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: "The number of requested seats exceeds the seats available!",
          },
        };
      }
    } else if (err instanceof Error) {
      db.connection.prepare("ROLLBACK").run();
      return {
        error: {
          type: "DB",
          msg: err.message,
        },
      };
    } else {
      db.connection.prepare("ROLLBACK").run();
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
      db.connection
        .prepare(
          "INSERT INTO purchasedTicket (bookingId, ticketType, qty) VALUES (?,?,?)"
        )
        .run(booking.id, type, qty);
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
          db.connection.prepare("ROLLBACK").run();
          return {
            error: {
              type: "DB",
              msg: err.message,
            },
          };
        }
      } else if (err instanceof Error) {
        db.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      } else {
        db.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "UNKNOWN",
            msg: `Error occured in ${__filename}`,
          },
        };
      }
    }
  }
  db.connection.prepare("COMMIT").run();
  return {
    id: booking.id,
    ...newBooking,
  };
};
