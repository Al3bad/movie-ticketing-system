import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PurchaseTickets, {
  purchaseTicketLoader,
} from "./components/pages/PurchaseTickets/PurchaseTickets";
import TicketList, {
  ticketListLoader,
} from "./components/pages/TicketList/TicketList";
import BookingList, {
  bookingListLoader,
} from "./components/pages/BookingList/BookingList";
import BookingDetail, {
  bookingDetailLoader,
} from "./components/pages/BookingDetail/BookingDetail";
import CustomerList, {
  customerListLoader,
} from "./components/pages/CustomerList/CustomerList";
import CustomerDetail, {
  customerDetailAction,
  customerDetailLoader,
} from "./components/pages/CustomerDetail/CustomerDetail";
import TicketDetail, {
  ticketDetailLoader,
} from "./components/pages/TicketDetail/TicketDetail";
import MovieList, {
  movieListLoader,
} from "./components/pages/MovieList/MovieList";
import MovieDetail, {
  movieDetailLoader,
} from "./components/pages/MovieDetail/MovieDetail";
import Root from "./components/UI/Root/Root";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Error from "./components/pages/Error/Error";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root title="" />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "purchase-tickets",
        element: <PurchaseTickets />,
        loader: purchaseTicketLoader,
      },
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
        loader: customerDetailLoader,
        action: customerDetailAction,
      },
      { path: "ticket", element: <TicketDetail />, loader: ticketDetailLoader },
      { path: "movie", element: <MovieDetail />, loader: movieDetailLoader },
      {
        path: "booking",
        element: <BookingDetail />,
        loader: bookingDetailLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
