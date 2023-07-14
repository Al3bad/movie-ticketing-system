import {
  NewCustomerSchema,
  NewMovieSchema,
  // NewTicketComponent,
  NewTicketSchema,
  // TicketSchema,
  UpdateCustomerSchema,
  PaginationOptsSchema,
  NewBookingSchema,
  GetMovieOptionsSchema,
  UpdateMovieSchema,
  TicketComponentSchema,
} from "@/common/validations";
import { faker } from "@faker-js/faker";
import {
  InvalidTicketComponentError,
  SeatsRangeError,
} from "backend/lib/errors";
import SQLite3, { Database, SqliteError } from "better-sqlite3";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

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
    await this.createTables();
    if (process.env.NODE_ENV === "test") {
      this.dropAll();
      await this.createTables();
      this.seedDB(10);
      process.on("SIGINT", () => this.deleteDB());
      process.on("beforeExit", () => this.deleteDB());
      process.on("exit", () => this.deleteDB());
    }
  };

  // ==============================================
  // ==> DB stuff
  // ==============================================
  createTables = async () => {
    try {
      const createTablesQueries = await fs.readFile(
        path.join(__dirname, "sqlite", "createTables.sql"),
        "utf8"
      );
      this.connection.exec(createTablesQueries);
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
    } catch (err: unknown) {
      console.log(err);
      console.error("[ERROR] Couldn't drop tables!");
      process.exit(1);
    }
  };

  // Methods
  deleteDB = async () => {
    try {
      await fs.rm(this.dbDir);
    } catch (err: unknown) {
      console.error("[ERROR] Couldn't delete DB file!");
      process.exit(1);
    }
  };

  resetDB = async () => {
    try {
      this.dropAll();
      this.connection = new SQLite3(this.dbDir);
    } catch (err: unknown) {
      console.log("[ERROR] Couldn't reset DB!");
      process.exit(1);
    }
  };

  seedDB = (seed?: number) => {
    faker.seed(seed || 10);
    // list of movies
    const movies: Movie[] = ["Avatar", "Frozen", "Spiderman", "John Wick"].map(
      (title) => {
        return {
          title,
          seatAvailable: faker.number.int({ min: 0, max: 60 }),
          isReleased: faker.datatype.boolean(),
        };
      }
    );
    movies.push({ title: "Test", seatAvailable: 50, isReleased: true });

    const tickets = [
      { type: "adult", price: 25 },
      { type: "child", price: 15 },
      { type: "student", price: 20 },
      {
        type: "Family4",
        components: [
          { type: "adult", qty: 2 },
          { type: "child", qty: 2 },
        ],
      },
      {
        type: "Family3",
        components: [
          { type: "adult", qty: 2 },
          { type: "child", qty: 1 },
        ],
      },
    ];

    const flatCustomerDiscountRate = faker.number.float({
      precision: 0.01,
    });
    const stepCustomerThreshold = faker.number.float({
      min: 10,
      max: 80,
      precision: 0.01,
    });

    const customers = new Array(10)
      .fill(0)
      .map((_) =>
        this.createRandomCustomer(
          flatCustomerDiscountRate,
          stepCustomerThreshold
        )
      );

    movies.forEach((movie) => {
      this.insertMovie(movie);
    });

    tickets.forEach((ticket) => {
      this.insertTicket(NewTicketSchema.parse(ticket));
    });

    customers.forEach((customer) => {
      this.insertCustomer(customer);
    });

    this.insertBooking({
      customer: {
        name: customers[0].name,
        email: customers[0].email,
        type: customers[0].type,
        discountRate: customers[0].discountRate || 0,
        threshold: customers[0].threshold,
      },
      title: movies.find((mv) => mv.seatAvailable > 5)?.title || "Test",
      tickets: [
        { type: "adult", qty: 1 },
        { type: "child", qty: 2 },
      ],
    } as z.infer<typeof NewBookingSchema>);
  };

  createRandomCustomer = (
    flatCustomerDiscountRate: number,
    stepCustomerThreshold: number
  ) => {
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
    if (customer.type === "Flat") {
      customer.discountRate = flatCustomerDiscountRate;
    }
    if (customer.type === "Step") {
      customer.threshold = stepCustomerThreshold;
      customer.discountRate = faker.number.float({
        precision: 0.01,
      });
    }
    return customer;
  };

  resetAndSeed = async (seed?: number) => {
    this.resetDB();
    await this.createTables();
    this.seedDB(seed);
  };

  // ==============================================
  // ==> Movie Queries
  // ==============================================
  insertMovie = (newMovie: Movie) => {
    try {
      const parsed = NewMovieSchema.parse(newMovie);
      const stmt = this.connection.prepare(
        "INSERT INTO movie(title, seatAvailable, isReleased) VALUES (@title,@seatAvailable,@isReleased)"
      );
      stmt.run({ ...parsed, isReleased: parsed.isReleased ? 1 : 0 });
      return newMovie;
    } catch (err: unknown) {
      if (
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_CHECK"
      ) {
        throw new SeatsRangeError("Invalid data", [
          {
            path: ["seatAvailable"],
            message: "seatAvailable must be a positive number",
          },
        ]);
      }
      throw err;
    }
  };

  getAllMovies = (opt: {
    onlyReleased?: boolean;
    includeIsReleased?: boolean;
  }) => {
    const { onlyReleased, includeIsReleased } =
      GetMovieOptionsSchema.parse(opt);
    return this.connection
      .prepare(
        `SELECT title, seatAvailable ${
          includeIsReleased ? ", isReleased" : ""
        } FROM movie WHERE isReleased = ?`
      )
      .all(onlyReleased ? 1 : 0);
  };

  getMovieByTitle = (
    title: string,
    opt: {
      onlyReleased?: boolean;
      includeIsReleased?: boolean;
    }
  ) => {
    const { onlyReleased, includeIsReleased } =
      GetMovieOptionsSchema.parse(opt);
    return this.connection
      .prepare(
        `SELECT title, seatAvailable ${
          includeIsReleased ? ", isReleased" : ""
        } FROM movie WHERE LOWER(title) = LOWER(?) AND isReleased = ?`
      )
      .get(z.string().nonempty().parse(title), onlyReleased ? 1 : 0) as Movie;
  };

  updateSeats = (requestedSeats: RequestedSeats) => {
    const { title, qty } = z
      .object({
        title: z.string().nonempty(),
        qty: z.number().int().positive(),
      })
      .parse(requestedSeats);
    try {
      return this.connection
        .prepare(
          "UPDATE movie SET seatAvailable = (SELECT seatAvailable FROM movie WHERE title = ?) - ? WHERE title = ?"
        )
        .run(title, qty, title);
    } catch (err: unknown) {
      if (
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_CHECK"
      ) {
        const movie = this.getMovieByTitle(title, { onlyReleased: false });
        throw new SeatsRangeError("Invalid data", [
          {
            path: ["qty"],
            message: `Requested ${qty} tickets but only ${movie.seatAvailable} seats are available!`,
          },
        ]);
      } else {
        throw err;
      }
    }
  };

  updateMovie = (
    title: string,
    newMovieInfo: z.infer<typeof UpdateMovieSchema>
  ) => {
    const newInfo = UpdateMovieSchema.parse(newMovieInfo);
    try {
      const info = this.connection
        .prepare(
          "UPDATE movie SET title = IFNULL(@newTitle, title), seatAvailable = IFNULL(@seatAvailable, seatAvailable), isReleased = IFNULL(@isReleased, isReleased) WHERE title = @title"
        )
        .run({ ...newInfo, title, newTitle: newInfo.title });
      if (info.changes === 0) return undefined;
      else return info;
    } catch (err: unknown) {
      if (
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_CHECK"
      ) {
        throw new SeatsRangeError("Invalid data", [
          {
            path: ["seatAvailable"],
            message: "seatAvailable must be a positive number",
          },
        ]);
      } else {
        throw err;
      }
    }
  };

  // NOTE: Movie can't be deleted due to the FK constrains
  // deleteMovie = (title: string) => {
  //   return title;
  // };

  // ==============================================
  // ==> Ticket Queries
  // ==============================================
  insertTicket = (newTicket: z.infer<typeof NewTicketSchema>) => {
    const parsed = NewTicketSchema.parse(newTicket);

    this.connection.prepare("BEGIN TRANSACTION").run();
    const stmt = this.connection.prepare(
      "INSERT INTO ticket(type, price) VALUES (@type,@price)"
    );
    stmt.run({ type: parsed.type, price: parsed.price });

    if (parsed.price === null) {
      // Group ticket
      for (const component of parsed.components) {
        this.insertTicketComponent(parsed.type, component);
      }
    }
    this.connection.prepare("COMMIT").run();
    return parsed;
  };

  insertTicketComponent = (
    type: string,
    newTicketComponent: z.infer<typeof TicketComponentSchema>
  ) => {
    const parsed = TicketComponentSchema.parse(newTicketComponent);

    if (type === parsed.type)
      throw new InvalidTicketComponentError("Invalid data");

    this.connection
      .prepare(
        "INSERT INTO ticketComponent (type, component, qty) VALUES (@type,@component,@qty)"
      )
      .run({ ...parsed, type, component: parsed.type });
    return parsed;
  };

  getTickets = (type?: string) => {
    const groupTicketDiscount = 0.8;
    const parsed = z.string().optional().parse(type);
    const stmt = this.connection.prepare(`SELECT  ticket.type,
                                          IFNULL(ticket.price, SUM(groupTicket.price) * @groupTicketDiscount)
                                              AS "price",
                                          IFNULL(SUM(tc.qty), 1)
                                              AS "qty"
                                          FROM ticket
                                          LEFT JOIN ticketComponent tc
                                              ON ticket.type = tc.type
                                          LEFT JOIN ticket groupTicket
                                              ON tc.component = groupTicket.type
                                          ${
                                            parsed
                                              ? "WHERE LOWER(ticket.type) = LOWER(@type)"
                                              : ""
                                          }
                                          GROUP BY ticket.type
                                          HAVING ticket.price IS NOT NULL OR groupTicket.price IS NOT NULL`);
    // single ticket
    if (parsed) return stmt.get({ groupTicketDiscount, type });
    // group ticket
    else return stmt.all({ groupTicketDiscount });
  };
  getAllTickets = () => {
    return this.getTickets();
  };

  getTicket = (type: string) => {
    return this.getTickets(type);
  };

  getComponentTickets = (type: string) => {
    return this.connection
      .prepare(
        `SELECT tc.component AS "type", tc.qty
        FROM ticket t
        JOIN ticketComponent tc
            ON t.type = tc.component
        WHERE LOWER(tc.type) = LOWER(?);`
      )
      .all(z.string().parse(type));
  };

  // NOTE: Ticket shouldn't be updated with the current DB design
  // updateTicket = (ticket: UpdateTicket) => {
  //   return ticket;
  // };

  // NOTE: Ticket component shouldn't be updated with the current DB design
  // updateTicketComponent = (ticketComponent: TicketComponent) => {
  //   return ticketComponent;
  // };

  // NOTE: Ticket can't be deleted due to the FK constrains
  // deleteTicket = (type: string) => {
  //   return type;
  // };

  // ==============================================
  // ==> Customer Queries
  // ==============================================
  insertCustomer = (newCustomer: Customer) => {
    const parsed = NewCustomerSchema.parse(newCustomer);
    try {
      const stmt = this.connection.prepare(
        "INSERT INTO customer(email, name, type, discountRate, threshold) VALUES (@email, @name, @type, @discountRate, @threshold)"
      );
      stmt.run(parsed);
      return parsed;
    } catch (err: unknown) {
      const customerExists =
        this.connection.inTransaction &&
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_PRIMARYKEY";
      if (customerExists) {
        return;
      }
      throw err;
    }
  };

  getCustomers = (
    paginationOpts: z.infer<typeof PaginationOptsSchema>
  ): Customer[] => {
    const parsed = PaginationOptsSchema.parse(paginationOpts);
    let stmt = "SELECT * FROM customer";
    if (typeof parsed.limit === "number") stmt += " LIMIT @limit";
    if (typeof parsed.page === "number") stmt += " OFFSET @page";
    return this.connection.prepare(stmt).all(parsed) as Customer[];
  };

  getAllCustomers = (): Customer[] => {
    return this.getCustomers({});
  };

  getCustomerByEmail = (email: string) => {
    return this.connection
      .prepare("SELECT * FROM customer WHERE LOWER(email) = LOWER(?)")
      .get(z.string().email().parse(email)) as Customer;
  };

  updateCustomer = (
    customerEmail: string,
    newCustoemrInfo: z.infer<typeof UpdateCustomerSchema>
  ) => {
    // NOTE: as of now, customer cannot update their type
    const email = z.string().email().parse(customerEmail);
    const newInfo = UpdateCustomerSchema.parse(newCustoemrInfo);
    // update the remaining details
    const info = this.connection
      .prepare(
        `UPDATE customer
          SET email = IFNULL(@newEmail, email),
              name = IFNULL(@name, name),
              type = IFNULL(@type, type),
              discountRate = IFNULL(@discountRate, discountRate),
              threshold = IFNULL(@threshold, threshold)
          WHERE LOWER(email) = LOWER(@email);`
      )
      .run({ email, ...newInfo });

    if (info.changes === 0) {
      return undefined;
    }

    if (newInfo.type === "Flat" && newInfo.discountRate) {
      // update discountRate for all flat reward customers
      this.updateDiscountRate(newInfo.discountRate);
    } else if (newInfo.type === "Step" && newInfo.threshold) {
      // update threshold for all step reward customers
      this.updateThreshold(newInfo.threshold);
    }

    return this.getCustomerByEmail(email);
  };

  updateDiscountRate = (newDiscountRate: number) => {
    return this.connection
      .prepare(
        "UPDATE customer SET discountRate = ? WHERE LOWER(type) = 'flat'"
      )
      .run(z.number().gt(0).lte(1).parse(newDiscountRate));
  };

  updateThreshold = (newThreshold: number) => {
    return this.connection
      .prepare("UPDATE customer SET threshold = ? WHERE LOWER(type) = 'step'")
      .run(z.number().positive().parse(newThreshold));
  };

  // NOTE: Customer can't be deleted due to the FK constrains
  // deleteCustomer = (email: string) => {
  //   const info = this.connection
  //     .prepare("DELETE FROM customer WHERE LOWER(email) = LOWER(?)")
  //     .run(z.string().email().parse(email));
  //   if (info.changes === 0) {
  //     return undefined;
  //   }
  //   return info;
  // };

  // ==============================================
  // ==> Booking Queries
  // ==============================================
  calculateRequestedTickets = (tickets: RequestedTicket[]) => {
    // FIXME: update calculate requested tickets correclty (components in group tickets)
    return Object.entries(tickets).reduce(
      (total, pair) => total + pair[1].qty,
      0
    );
  };

  insertBooking = (newBooking: z.infer<typeof NewBookingSchema>) => {
    const { customer, title, tickets } = NewBookingSchema.parse(newBooking);
    // Start a inTransaction
    this.connection.prepare("BEGIN").run();
    // Create new customer, if not exists
    this.insertCustomer(customer);
    const booking: { id?: number | bigint } = {};
    // Insert into booking table
    booking.id = this.connection
      .prepare(
        "INSERT INTO booking(customerEmail, movieTitle, discountRate, threshold) VALUES (?,?,?,?)"
      )
      .run(
        customer.email,
        title,
        customer.discountRate,
        customer.threshold
      ).lastInsertRowid;
    // Update movies
    this.updateSeats({
      title: title,
      qty: this.calculateRequestedTickets(tickets),
    });
    // Insert puchased tickets into "purchased ticket" table
    for (const { type, qty } of tickets) {
      this.connection
        .prepare(
          `INSERT INTO purchasedTicket (bookingId, ticketType, ticketPrice, qty)
            VALUES (?,?,(SELECT IFNULL(t.price, SUM(t2.price) * 0.8) AS price
                        FROM ticket t
                        LEFT JOIN ticketComponent tc
                            ON t.type = tc.type
                        LEFT JOIN ticket t2
                            ON tc.component = t2.type
                        WHERE t.type = ?),
                    ?)`
        )
        .run(booking.id, type, type, qty);
    }
    // Commit transaction then return
    const result = this.getBookingById(booking.id);
    this.connection.prepare("COMMIT").run();
    return result;
  };

  getAllBooking = () => {
    return this.connection
      .prepare(
        `SELECT b.id, c.*,
                b.movieTitle AS title,
                pt.ticketType, pt.ticketprice, pt.qty,
                tc.component, tc.qty AS componentTicketQty,
                total.total AS totalTicketPrice
          FROM booking b
          JOIN customer c
              ON b.customerEmail = c.email
          JOIN purchasedTicket pt
              ON b.id = pt.bookingId
          -- Get components of group tickets (if any)
          LEFT JOIN ticketComponent tc
              ON pt.ticketType = tc.type
          -- Get price of single tickets
          LEFT JOIN ticket singleTicket
              on pt.ticketType = singleTicket.type
          LEFT JOIN (SELECT b.id, SUM(pt.ticketPrice * pt.qty) as total
                      FROM booking b
                      JOIN customer c
                          ON b.customerEmail = c.email
                      JOIN purchasedTicket pt
                          ON b.id = pt.bookingId
                      -- Get components of group tickets (if any)
                      LEFT JOIN ticketComponent tc
                          ON pt.ticketType = tc.type
                      -- Get price of single tickets
                      LEFT JOIN ticket singleTicket
                          ON pt.ticketType = singleTicket.type
                      GROUP BY b.id) total
              ON b.id = total.id`
      )
      .all();
  };

  getBookingById = (id: number | bigint) => {
    return this.connection
      .prepare(
        `SELECT b.id, c.*,
                b.movieTitle AS title, b.discountRate, b.threshold,
                pt.ticketType, pt.ticketPrice, pt.qty,
                tc.component, tc.qty AS componentTicketQty,
                (SELECT SUM(pt.ticketPrice * pt.qty) as total
                  FROM booking b
                  JOIN customer c
                      ON b.customerEmail = c.email
                  JOIN purchasedTicket pt
                      ON b.id = pt.bookingId
                  -- Get components of group tickets (if any)
                  LEFT JOIN ticketComponent tc
                      ON pt.ticketType = tc.type
                  -- Get price of single tickets
                  LEFT JOIN ticket singleTicket
                      on pt.ticketType = singleTicket.type
                  WHERE b.id = @id) AS totalTicketPrice
          FROM booking b
          JOIN customer c
              ON b.customerEmail = c.email
          JOIN purchasedTicket pt
              ON b.id = pt.bookingId
          -- Get components of group tickets (if any)
          LEFT JOIN ticketComponent tc
              ON pt.ticketType = tc.type
          -- Get price of single tickets
          LEFT JOIN ticket singleTicket
              on pt.ticketType = singleTicket.type
          WHERE b.id = @id`
      )
      .all({ id: z.number().positive().int().or(z.bigint()).parse(id) });
  };
}

export default new DB(dbName);
