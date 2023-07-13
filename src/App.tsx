import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PurchaseTickets from "./components/pages/PurchaseTickets/PurchaseTickets";
import TicketList from "./components/pages/TicketList/TicketList";
import BookingList from "./components/pages/BookingList/BookingList";
import BookingDetail from "./components/pages/BookingDetail/BookingDetail";
import CustomerList from "./components/pages/CustomerList/CustomerList";
import CustomerDetail from "./components/pages/CustomerDetail/CustomerDetail";
import TicketDetail from "./components/pages/TicketDetail/TicketDetail";
import MovieList from "./components/pages/MovieList/MovieList";
import MovieDetail from "./components/pages/MovieDetail/MovieDetail";
import Layout from "./components/UI/Layout/Layout";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import PageNotFound from "./components/pages/PageNotFound/PageNotFound";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout title="" />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "purchase-tickets", element: <PurchaseTickets /> },
      { path: "customers", element: <CustomerList /> },
      { path: "tickets", element: <TicketList /> },
      { path: "movies", element: <MovieList /> },
      { path: "bookings", element: <BookingList /> },
      { path: "customer", element: <CustomerDetail /> },
      { path: "ticket", element: <TicketDetail /> },
      { path: "movie", element: <MovieDetail /> },
      { path: "booking", element: <BookingDetail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
