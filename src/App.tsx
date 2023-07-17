import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PurchaseTickets from "./components/pages/PurchaseTickets/PurchaseTickets";
import TicketList, {
  ticketListLoader,
} from "./components/pages/TicketList/TicketList";
import BookingList, {
  bookingListLoader,
} from "./components/pages/BookingList/BookingList";
import BookingDetail from "./components/pages/BookingDetail/BookingDetail";
import CustomerList, {
  customerListLoader,
} from "./components/pages/CustomerList/CustomerList";
import CustomerDetail from "./components/pages/CustomerDetail/CustomerDetail";
import TicketDetail, {
  ticketDetailLoader,
} from "./components/pages/TicketDetail/TicketDetail";
import MovieList, {
  movieListLoader,
} from "./components/pages/MovieList/MovieList";
import MovieDetail, {
  movieDetailLoader,
} from "./components/pages/MovieDetail/MovieDetail";
import Layout from "./components/UI/Layout/Layout";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Error from "./components/pages/Error/Error";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout title="" />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "purchase-tickets", element: <PurchaseTickets /> },
      {
        path: "customers",
        element: <CustomerList />,
        loader: customerListLoader,
      },
      { path: "tickets", element: <TicketList />, loader: ticketListLoader },
      { path: "movies", element: <MovieList />, loader: movieListLoader },
      { path: "bookings", element: <BookingList />, loader: bookingListLoader },
      {
        path: "customer",
        element: <CustomerDetail />,
      },
      { path: "ticket", element: <TicketDetail />, loader: ticketDetailLoader },
      { path: "movie", element: <MovieDetail />, loader: movieDetailLoader },
      { path: "booking", element: <BookingDetail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
