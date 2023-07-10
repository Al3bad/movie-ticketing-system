import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout title="" />,
    children: [
      { path: "/", element: <PurchaseTickets /> },
      { path: "/customer", element: <CustomerList /> },
      { path: "/ticket", element: <TicketList /> },
      { path: "/movie", element: <MovieList /> },
      { path: "/booking", element: <BookingList /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/customer/:id", element: <CustomerDetail /> },
      { path: "/ticket/:id", element: <TicketDetail /> },
      { path: "/movie/:id", element: <MovieDetail /> },
      { path: "/booking/:id", element: <BookingDetail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
