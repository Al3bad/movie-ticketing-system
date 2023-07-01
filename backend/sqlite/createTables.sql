-- Customer (_email_, name, type, discountRate, threshold)
-- Ticket (_type_, compnent*, price, qty)
-- Movie (_title_, seatAvailable, isReleased)
-- Booking (_customerEmail*_, _movieTitle*_)
-- BookingHasTicket(_customerEmail*_, _movieTitle*_, _ticketName*_)

CREATE TABLE IF NOT EXISTS customer (
    email TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    discountRate REAL NOT NULL,
    threshold REAL NOT NULL
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
    customerEmail TEXT NOT NULL,
    movieTitle TEXT NOT NULL,
    PRIMARY KEY (customerEmail, movieTitle),
    FOREIGN KEY (customerEmail) REFERENCES customer (email),
    FOREIGN KEY (movieTitle) REFERENCES movie (title)
);

CREATE TABLE IF NOT EXISTS bookingWithTickets (
    customerEmail TEXT NOT NULL,
    movieTitle TEXT NOT NULL,
    ticketType TEXT NOT NULL,
    PRIMARY KEY (customerEmail, movieTitle, ticketType),
    FOREIGN KEY (customerEmail) REFERENCES customer (email),
    FOREIGN KEY (movieTitle) REFERENCES movie (title),
    FOREIGN KEY (ticketType) REFERENCES ticket (type)
);


