import { UpdateCustomerSchema } from "@/common/validations";
import { faker } from "@faker-js/faker";
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
      return { error: this.dbErrorHandler(err) };
    }
  };

  // Methods
  deleteDB = async () => {
    try {
      await fs.rm(this.dbDir);
    } catch (err: unknown) {
      process.exit(1);
    }
  };

  resetDB = async () => {
    try {
      this.dropAll();
      this.connection = new SQLite3(this.dbDir);
    } catch (err: unknown) {
      console.log("Couldn't reset DB!");
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
      if (ticket.components) {
        this.insertTicket(ticket);
        ticket.components.forEach((c) =>
          this.insertTicketComponent({
            type: ticket.type,
            component: c.component,
            qty: c.qty,
          })
        );
      } else {
        this.insertTicket(ticket);
      }
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
    } as NewBooking);
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

  getAllMovies = (opt: {
    onlyReleased?: boolean;
    includeIsReleased?: boolean;
  }) => {
    type EMovie = Omit<Movie, "isReleased">;
    try {
      return this.connection
        .prepare(
          `SELECT title, seatAvailable ${
            opt.includeIsReleased ? ", isReleased" : ""
          } FROM movie WHERE isReleased = ?`
        )
        .all(opt.onlyReleased ? 1 : 0) as Array<Movie | EMovie>;
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  getMoiveByTitle = (
    title: string,
    opt: {
      onlyReleased?: boolean;
      includeIsReleased?: boolean;
    }
  ) => {
    type EMovie = Omit<Movie, "isReleased">;
    try {
      return this.connection
        .prepare(
          `SELECT title, seatAvailable ${
            opt.includeIsReleased ? ", isReleased" : ""
          } FROM movie WHERE title = ? AND isReleased = ?`
        )
        .get(title, opt.onlyReleased ? 1 : 0) as Movie | EMovie;
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  updateSeats = ({ title, qty }: RequestedSeats) => {
    try {
      return this.connection
        .prepare(
          "UPDATE movie SET seatAvailable = (SELECT seatAvailable FROM movie WHERE title = ?) - ? WHERE title = ?"
        )
        .run(title, qty, title);
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  updateMovie = ({
    title,
    seatAvailable = null,
    isReleased = null,
  }: UpdateMovie) => {
    try {
      return this.connection
        .prepare(
          "UPDATE movie SET title = IFNULL(?, title), seatAvailable = IFNULL(?, seatAvailable), isReleased = IFNULL(?, isReleased)"
        )
        .run(title, seatAvailable, isReleased);
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  deleteMovie = (title: string) => {
    // TODO:
    return title;
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
      throw { error: this.dbErrorHandler(err) };
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
      throw { error: this.dbErrorHandler(err) };
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
      throw { error: this.dbErrorHandler(err) };
    }
  };

  updateTicket = (ticket: UpdateTicket) => {
    // TODO:
    return ticket;
  };

  updateTicketComponent = (ticketComponent: TicketComponent) => {
    // TODO:
    return ticketComponent;
  };

  deleteTicket = (type: string) => {
    // TODO:
    return type;
  };

  // ==============================================
  // ==> Customer Queries
  // ==============================================
  insertCustomer = (newCustomer: Customer) => {
    const { email, name, type } = newCustomer;

    let discountRate = null;
    let threshold = null;
    if (newCustomer.type === "Step") {
      if (!newCustomer.threshold)
        throw Error("Threshold value is missing for reward step customer!");
      threshold = newCustomer.threshold;
    }
    if (newCustomer.type !== "Normal") {
      if (!newCustomer.discountRate) {
        throw Error(
          "Discount rate value is missing for reward flat/step customer!"
        );
      }
      discountRate = newCustomer.discountRate;
    }

    try {
      const stmt = this.connection.prepare(
        "INSERT INTO customer(email, name, type, discountRate, threshold) VALUES (?,?,?,?,?)"
      );
      stmt.run(email, name, type, discountRate, threshold);
      return newCustomer;
    } catch (err: unknown) {
      const customerExists =
        this.connection.inTransaction &&
        err instanceof SqliteError &&
        err.code === "SQLITE_CONSTRAINT_PRIMARYKEY";
      if (customerExists) {
        return;
      }
      throw { error: this.dbErrorHandler(err) };
    }
  };

  getCustomers = ({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Customer[] => {
    try {
      let stmt = "SELECT * FROM customer";
      if (typeof limit === "number") stmt += " LIMIT @limit";
      if (typeof page === "number") stmt += " OFFSET @page";
      return this.connection.prepare(stmt).all({ page, limit }) as Customer[];
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  getAllCustomers = (): Customer[] => {
    return this.getCustomers({});
  };

  getCustomerByEmail = (email: string) => {
    try {
      return this.connection
        .prepare("SELECT * FROM customer WHERE LOWER(email) = LOWER(?)")
        .get(email) as Customer;
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  updateCustomer = (
    customerEmail: string,
    newCustoemrInfo: z.infer<typeof UpdateCustomerSchema>
  ) => {
    // NOTE: as of now, customer cannot update their type
    const email = z.string().email().parse(customerEmail);
    const newInfo = UpdateCustomerSchema.parse(newCustoemrInfo);

    // update the remaining details
    const result = this.connection
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

    if (result.changes === 0) {
      throw Error("Customer not found! Abort operation!");
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
    this.connection
      .prepare(
        "UPDATE customer SET discountRate = ? WHERE LOWER(type) = 'flat'"
      )
      .run(z.number().gt(0).lte(1).parse(newDiscountRate));
  };

  updateThreshold = (newThreshold: number) => {
    this.connection
      .prepare("UPDATE customer SET threshold = ? WHERE LOWER(type) = 'step'")
      .run(z.number().positive().parse(newThreshold));
  };

  deleteCustomer = (email: string) => {
    // TODO:
    return email;
  };

  // ==============================================
  // ==> Booking Queries
  // ==============================================
  calculateRequestedTickets = (tickets: RequestedTicket[]) => {
    return Object.entries(tickets).reduce(
      (total, pair) => total + pair[1].qty,
      0
    );
  };

  insertBooking = (newBooking: NewBooking) => {
    const { customer, title, tickets } = newBooking;
    try {
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
          (customer as StepCustomer)?.discountRate,
          (customer as StepCustomer)?.threshold || null
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
    } catch (err: unknown) {
      this.connection.prepare("ROLLBACK").run();
      throw { error: this.dbErrorHandler(err) };
    }
  };

  getAllBooking = () => {
    try {
      return this.connection
        .prepare(
          `SELECT b.id, c.*,
                b.movieTitle AS title, b.discountRate, b.threshold,
                pt.ticketType, pt.ticketprice, pt.qty,
                tc.component, tc.qty AS componentTicketQty
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
              on pt.ticketType = singleTicket.type`
        )
        .all();
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
  };

  getBookingById = (id: number | bigint) => {
    try {
      return this.connection
        .prepare(
          `SELECT b.id, c.*,
                b.movieTitle AS title, b.discountRate, b.threshold,
                pt.ticketType, pt.ticketprice, pt.qty,
                tc.component, tc.qty AS componentTicketQty
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
          WHERE b.id = ?`
        )
        .all(id);
    } catch (err: unknown) {
      throw { error: this.dbErrorHandler(err) };
    }
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
