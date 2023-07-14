# Description

...

## Features:

- Create new customer from "/customer" page
- Create new movie from "/movie" page
- Create new ticket type from "/type" page
- Create new booking from "/purchase-tickets" page
- Edit discount rate, threshold, name ane email of the customer
- Edit title and isReleased for a movie
- Display list of customers/movies/ticket types/bookings
- Dashboard
- Filter customers by name
- Filter movies by title
- Filter tickets by type
- Filter bookings by id

# Commands

| CMD                | Description                                     |
| :----------------- | :---------------------------------------------- |
| npm run dev        | Run development server for frontend             |
| npm run dev:server | Run web server for backend                      |
| npm run dev:all    | Run both froend & backend servers               |
| npm run db:init    | Recreate all tables in DB & seed them with data |
| npm run test       | Run test                                        |

# Routes

| Status | Route                    | Description                          |
| :----: | :----------------------- | :----------------------------------- |
|   ✅   | POST /api/booking        | Create new booking                   |
|   ✅   | GET /api/booking         | Get all bookings                     |
|   ✅   | GET /api/booking/:id     | Get booking by id                    |
|   ✅   | POST /api/customer/      | Create new customer                  |
|   ✅   | GET /api/customer/       | Get all customers                    |
|   ✅   | GET /api/customer/:email | Get customer by email                |
|   ✅   | PUT /api/customer/       | Update all reward flat/step customer |
|   ✅   | PUT /api/customer/:email | Edit customer info                   |
|   ✅   | POST /api/movie/         | Create new movie                     |
|   ✅   | GET /api/movie/          | Get all movies                       |
|   ✅   | GET /api/movie/:title    | Get movie by title                   |
|   ✅   | PUT /api/movie/:title    | Edit movie info                      |
|   ✅   | POST /api/ticket/        | Create new ticket type               |
|   ✅   | GET /api/ticket/         | Get all ticket types                 |
|   ✅   | GET /api/ticket/:type    | Get ticket type                      |

# TODO

- [ ] Improve format of the error responses
- [ ] Generate types from zod schemas
- [ ] Cleanup unused types
- [ ] Cleanup code and make it consistent
- [ ] Test /api/customer/... endpoints
- [ ] Test /api/movie/... endpoints
- [ ] Test /api/ticket/... endpoints
- [ ] Test /api/booking/... endpoints

# Server Structure

![High level structure of the server](./images/server-structure.png)
