-- DB Config
PRAGMA foreign_keys = ON;

-- Create tables
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
    isReleased BOOLEAN DEFAULT FALSE,
    -- prevent insertion when seats >= 0
    CHECK(seatAvailable >= 0)
);


CREATE TABLE IF NOT EXISTS ticket (
    type TEXT NOT NULL PRIMARY KEY,
    price REAL
);

CREATE TABLE IF NOT EXISTS ticketComponent (
    type TEXT NOT NULL,
    component TEXT NOT NULL,
    qty INTEGER NOT NULL,
    -- prevent insertion when type == component
    CHECK(LOWER(type) != LOWER(component)),
    -- Composite PK
    PRIMARY KEY (type, component),
    -- FKs
    FOREIGN KEY (type) REFERENCES ticket(type)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (component) REFERENCES ticket(type)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id INTEGER PRIMARY KEY,
    customerEmail TEXT NOT NULL,
    movieTitle TEXT NOT NULL,
    -- FKs
    FOREIGN KEY (customerEmail) REFERENCES customer(email)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (movieTitle) REFERENCES movie(title)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS purchasedTicket (
    bookingId INTEGER NOT NULL,
    ticketType TEXT NOT NULL,
    ticketprice REAL NOT NULL,
    qty INTEGER NOT NULL,
    -- Composite PK
    PRIMARY KEY (bookingId, ticketType),
    -- FKs
    FOREIGN KEY (bookingId) REFERENCES booking (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (ticketType) REFERENCES ticket (type)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);