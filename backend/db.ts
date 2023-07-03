import fs from "node:fs";
import path from "node:path";
import { faker } from "@faker-js/faker";
import SQLite3, { Database } from "better-sqlite3";
import {
  initDB,
  insertBooking,
  insertCustomer,
  insertMovie,
  insertTicket,
  insertTicketComponent,
} from "./dbQueries";

const dbDir = path.join(__dirname, process.env.DB_NAME || "database.db");

class AppDB {
  // Types
  dbDir: string;
  connection: Database;

  // Constructor
  constructor(dbDir: string) {
    this.dbDir = dbDir;
    this.connection = new SQLite3(dbDir);
  }

  // Methods
  async resetDB() {
    console.log("Resetting DB ...");
    console.log(this.dbDir);
    try {
      // this.connection.close();
      fs.rmSync(this.dbDir);
      this.connection = new SQLite3(this.dbDir);
      console.log("Rest DB is done!");
    } catch (err: unknown) {
      console.log("Couldn't reset DB!");
      process.exit(1);
    }
  }

  seedDB() {
    console.log("Seeding DB ...");
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
      console.log(insertMovie(movie));
    });

    tickets.forEach((ticket) => {
      if (ticket.components) {
        console.log(insertTicket(ticket));
        ticket.components.forEach((c) =>
          console.log(
            insertTicketComponent({
              type: ticket.type,
              component: c.component,
              qty: c.qty,
            })
          )
        );
      } else {
        console.log(insertTicket(ticket));
      }
    });

    customers.forEach((customer) => {
      console.log(insertCustomer(customer));
    });

    insertBooking({
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

  async resetAndSeed() {
    this.resetDB();
    await initDB();
    this.seedDB();
  }
}

export default new AppDB(dbDir);
