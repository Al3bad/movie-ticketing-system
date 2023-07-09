# Description

...

# Commands

| CMD                | Description                                     |
| :----------------- | :---------------------------------------------- |
| npm run dev        | Run development server for frontend             |
| npm run dev:server | Run web server for backend                      |
| npm run dev:all    | Run both froend & backend servers               |
| npm run db:init    | Recreate all tables in DB & seed them with data |
| npm run test       | Run test                                        |

# Routes

| Status | Route                          | Description                          |
| :----: | :----------------------------- | :----------------------------------- |
|   ✅   | POST /api/booking              | Create new booking                   |
|   ✅   | GET /api/booking               | Get all bookings                     |
|   ✅   | GET /api/booking/\<id\>        | Get booking by id                    |
|   ✅   | GET /api/customer/             | Get all customers                    |
|   ✅   | POST /api/customer/            | Create new customer                  |
|   ✅   | GET /api/customer/\<email\>    | Get customer by email                |
|   ✅   | PUT /api/customer/\<email\>    | Edit customer info                   |
|   ✅   | PUT /api/customer/             | Update all reward flat/step customer |
|   ✅   | DELETE /api/customer/\<email\> | Delete customer                      |
|   ✅   | GET /api/movie/                | Get all movies                       |
|   ✅   | GET /api/movie/\<title\>       | Get movie by title                   |
|        | PUT /api/movie/\<title\>       | Edit moive info                      |
|        | DELETE /api/movie/\<title\>    | Delete moive                         |
|   ✅   | GET /api/ticket/               | Get all ticket types                 |
|        | GET /api/ticket/\<type\>       | Get ticket type by type name         |
|        | PUT /api/ticket/\<type\>       | Edit ticket type info                |
|        | DELETE /api/ticket/\<type\>    | Delete ticket type                   |
