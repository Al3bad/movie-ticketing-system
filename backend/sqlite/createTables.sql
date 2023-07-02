PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customer (
    email TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    discountRate REAL DEFAULT 0,
    threshold REAL
);

CREATE TABLE IF NOT EXISTS movie (
    title TEXT NOT NULL PRIMARY KEY,
    seatAvailable INTEGER NOT NULL,
    isReleased BOOLEAN NOT NULL
);


CREATE TABLE IF NOT EXISTS ticket (
    type TEXT NOT NULL PRIMARY KEY,
    component TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL,
    FOREIGN KEY (component) REFERENCES ticket (type)
);

CREATE TABLE IF NOT EXISTS booking (
    id INTEGER PRIMARY KEY,
    customerEmail TEXT NOT NULL,
    movieTitle TEXT NOT NULL,
    FOREIGN KEY (customerEmail) REFERENCES customer (email),
    FOREIGN KEY (movieTitle) REFERENCES movie (title)
);

CREATE TABLE IF NOT EXISTS purchasedTicket (
    bookingId INTEGER NOT NULL,
    ticketType TEXT NOT NULL,
    qty INTEGER NOT NULL,
    PRIMARY KEY (bookingId, ticketType),
    FOREIGN KEY (bookingId) REFERENCES booking (id)
);
