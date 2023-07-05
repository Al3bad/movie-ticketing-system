import fs from "node:fs/promises";
import path from "node:path";
import { faker } from "@faker-js/faker";
import SQLite3, { Database, SqliteError } from "better-sqlite3";

let dbName = process.env.DB_NAME || "database.db";
if (process.env.NODE_ENV === "test") {
  dbName = "database-test.db";
}

export class DB {
  // Types
  dbName: string;
  dbDir: string;
  connection: Database;

  // Constructor
  constructor(dbName: string) {
    this.dbName = dbName;
    this.dbDir = path.join(__dirname, dbName);
    this.connection = new SQLite3(this.dbDir);
    this.init();
  }

  init = async () => {
    console.log("DB Name: " + this.dbName);
    this.dropAll();
    await this.createTables();
    this.seedDB(10);
    console.log("DB is ready!");
    if (process.env.NODE_ENV === "test") {
      process.on("SIGINT", () => this.deleteDB());
      process.on("beforeExit", () => this.deleteDB());
      process.on("exit", () => this.deleteDB());
    }
  };

  // ==============================================
  // ==> Init DB
  // ==============================================
  createTables = async () => {
    try {
      const createTablesQueries = await fs.readFile(
        path.join(__dirname, "sqlite", "createTables.sql"),
        "utf8"
      );
      this.connection.exec(createTablesQueries);
      console.log("DB is initialised!");
    } catch (err: unknown) {
      console.log("[ERROR] Couldn't read the sql file to init the DB");
      process.exit(1);
    }
  };

  dropAll = () => {
    try {
      const tables = this.connection
        .prepare(
          "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'  ORDER BY rootpage DESC"
        )
        .all();
      tables.forEach((table: any) => {
        if (table?.name)
          this.connection.prepare("DROP TABLE IF EXISTS " + table.name).run();
      });
      console.log("All tables dropped!");
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  // Methods
  async deleteDB() {
    try {
      await fs.rm(this.dbDir);
      console.log(dbName + " DB has been deleted!");
    } catch (err: unknown) {
      process.exit(1);
    }
  }

  async resetDB() {
    console.log("Resetting DB ...");
    // console.log(this.dbDir);
    try {
      this.dropAll();
      this.connection = new SQLite3(this.dbDir);
      console.log("Reset DB is done!");
    } catch (err: unknown) {
      console.log("Couldn't reset DB!");
      process.exit(1);
    }
  }

  seedDB(seed?: number) {
    console.log("Seeding DB ...");
    faker.seed(seed || 10);
    // list of movies
    const movies: NewMovie[] = [
      "Avatar",
      "Frozen",
      "Spiderman",
      "John Wick",
    ].map((title) => {
      return {
        title,
        seatAvailable: faker.number.int({ min: 0, max: 60 }),
        isReleased: faker.datatype.boolean(),
      };
    });
    movies.push({ title: "Test", seatAvailable: 50, isReleased: true });

    const tickets = [
      { type: "adult", price: 25 },
      { type: "child", price: 15 },
      { type: "student", price: 20 },
      {
        type: "Family4",
        components: [
          { component: "adult", qty: 2 },
          { component: "child", qty: 2 },
        ],
      },
      {
        type: "Family3",
        components: [
          { component: "adult", qty: 2 },
          { component: "child", qty: 1 },
        ],
      },
    ];

    const customers = new Array(10)
      .fill(0)
      .map((_) => this.createRandomCustomer());

    movies.forEach((movie) => {
      console.log(this.insertMovie(movie));
    });

    tickets.forEach((ticket) => {
      if (ticket.components) {
        console.log(this.insertTicket(ticket));
        ticket.components.forEach((c) =>
          console.log(
            this.insertTicketComponent({
              type: ticket.type,
              component: c.component,
              qty: c.qty,
            })
          )
        );
      } else {
        console.log(this.insertTicket(ticket));
      }
    });

    customers.forEach((customer) => {
      console.log(this.insertCustomer(customer));
    });

    this.insertBooking({
      customer: {
        name: customers[0].name,
        email: customers[0].email,
        type: customers[0].type,
      },
      movie: movies.find((mv) => mv.seatAvailable > 5)?.title || "Test",
      tickets: [
        { type: "adult", qty: 1 },
        { type: "child", qty: 2 },
      ],
    });
  }

  createRandomCustomer() {
    const randomType: CustomerType = faker.helpers.arrayElement([
      "Normal",
      "Flat",
      "Step",
    ]);
    const customer: any = {
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: "test.dev" }),
      type: randomType,
    };
    if (customer.type !== "Normal") {
      customer.discountRate = faker.number.float({
        min: 0.0,
        max: 0.9,
        precision: 0.1,
      });
    }
    if (customer.type === "Step") {
      customer.threshold = faker.number.float({
        min: 10,
        max: 80,
        precision: 0.01,
      });
    }
    return customer;
  }

  async resetAndSeed(seed?: number) {
    this.resetDB();
    await this.createTables();
    this.seedDB(seed);
  }

  // ==============================================
  // ==> Movie Queries
  // ==============================================
  insertMovie = (newMovie: NewMovie) => {
    const { title, seatAvailable, isReleased } = newMovie;

    try {
      const stmt = this.connection.prepare(
        "INSERT INTO movie(title, seatAvailable, isReleased) VALUES (?,?,?)"
      );
      stmt.run(title, seatAvailable, isReleased ? 1 : 0);
      return newMovie;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  getAllMovies = () => {
    type EMoive = Omit<Movie, "isReleased">;
    try {
      const stmt = this.connection.prepare(
        "SELECT title, seatAvailable FROM movie WHERE isReleased = true"
      );
      const data = stmt.all() as EMoive[];
      return data;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  // ==============================================
  // ==> Ticket Queries
  // ==============================================
  insertTicket = (newTicket: NewTicket) => {
    const { type, price = null } = newTicket;

    try {
      const stmt = this.connection.prepare(
        "INSERT INTO ticket(type, price) VALUES (?,?)"
      );
      stmt.run(type, price);
      return newTicket;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  insertTicketComponent = (newTicketComponent: NewTicketComponent) => {
    const { type, component, qty } = newTicketComponent;

    try {
      const stmt = this.connection.prepare(
        "INSERT INTO ticketComponent(type, component, qty) VALUES (?,?,?)"
      );
      stmt.run(type, component, qty);
      return newTicketComponent;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  getAllTickets = () => {
    const groupTicketDiscount = 0.8;
    try {
      const stmt = this.connection.prepare(
        `SELECT  ticket.type,
        IFNULL(ticket.price, SUM(groupTicket.price) * ?)
            AS "price",
        IFNULL(SUM(tc.qty), 1)
            AS "qty"
        FROM ticket
        LEFT JOIN ticketComponent tc
            ON ticket.type = tc.type
        LEFT JOIN ticket groupTicket
            ON tc.component = groupTicket.type
        GROUP BY ticket.type
        HAVING ticket.price IS NOT NULL OR groupTicket.price IS NOT NULL`
      );
      const data = stmt.all(groupTicketDiscount) as Ticket[];
      return data;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  // ==============================================
  // ==> Customer Queries
  // ==============================================
  // TODO: type it properly
  insertCustomer = (newCustomer: any) => {
    const { email, name, type, discoundRate, threshold } = newCustomer;

    try {
      const stmt = this.connection.prepare(
        "INSERT INTO customer(email, name, type, discountRate, threshold) VALUES (?,?,?,?,?)"
      );
      stmt.run(email, name, type, discoundRate, threshold);
      return newCustomer;
    } catch (err: unknown) {
      return { error: this.dbErrorHandler(err) };
    }
  };

  // ==============================================
  // ==> Booking Queries
  // ==============================================
  insertBooking = (newBooking: NewBooking) => {
    const { customer, movie, tickets } = newBooking;

    // Create new customer, if not exists
    try {
      this.connection.prepare("BEGIN").run();
      this.connection
        .prepare("INSERT INTO customer(email, name, type) VALUES (?, ?, ?)")
        .run(customer.email, customer.name, customer.type);
    } catch (err: unknown) {
      const error = this.dbErrorHandler(err);
      if (
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_PRIMARYKEY"
      ) {
        console.log("Customer already exists!");
      } else {
        this.connection.prepare("ROLLBACK").run();
        return { error: error };
      }
    }

    // Insert into booking table
    const booking: { id?: number | bigint } = {};
    try {
      const info = this.connection
        .prepare("INSERT INTO booking(customerEmail, movieTitle) VALUES (?, ?)")
        .run(customer.email, movie);
      booking.id = info.lastInsertRowid;
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
          this.connection.prepare("ROLLBACK").run();
          return {
            error: {
              type: "DB",
              msg: err.message,
            },
          };
        }
      } else if (err instanceof Error) {
        this.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      } else {
        this.connection.prepare("ROLLBACK").run();
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

      this.connection
        .prepare(
          "UPDATE movie SET seatAvailable = (SELECT seatAvailable FROM movie WHERE title = ?) - ? WHERE title = ?"
        )
        .run(movie, totalTickets, movie);
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === "SQLITE_CONSTRAINT_CHECK") {
          this.connection.prepare("ROLLBACK").run();
          return {
            error: {
              type: "DB",
              msg: "The number of requested seats exceeds the seats available!",
            },
          };
        }
      } else if (err instanceof Error) {
        this.connection.prepare("ROLLBACK").run();
        return {
          error: {
            type: "DB",
            msg: err.message,
          },
        };
      } else {
        this.connection.prepare("ROLLBACK").run();
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
        this.connection
          .prepare(
            "INSERT INTO purchasedTicket (bookingId, ticketType, qty) VALUES (?,?,?)"
          )
          .run(booking.id, type, qty);
      } catch (err: unknown) {
        if (err instanceof SqliteError) {
          if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            this.connection.prepare("ROLLBACK").run();
            return {
              error: {
                type: "DB",
                msg: err.message,
              },
            };
          }
        } else if (err instanceof Error) {
          this.connection.prepare("ROLLBACK").run();
          return {
            error: {
              type: "DB",
              msg: err.message,
            },
          };
        } else {
          this.connection.prepare("ROLLBACK").run();
          return {
            error: {
              type: "UNKNOWN",
              msg: `Error occured in ${__filename}`,
            },
          };
        }
      }
    }
    this.connection.prepare("COMMIT").run();
    return {
      id: booking.id,
      ...newBooking,
    };
  };
  // ==============================================
  // ==> Error Handling
  // ==============================================
  dbErrorHandler = (err: unknown) => {
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
        `[ERROR] ${
          (err as Error).message
        }.\n\nOccured in filename: ${__filename}`
      );
      return {
        type: "UNKNOWN",
        msg: "Server error. Please contact the developer!",
      };
    }
  };
}

export default new DB(dbName);
