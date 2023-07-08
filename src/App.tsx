import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PurchaseTickets from "./components/pages/PurchaseTickets/PurchaseTickets";
import TicketList from "./components/pages/TicketList/TicketList";
import BookingList from "./components/pages/BookingList/BookingList";
import BookingDetail from "./components/pages/BookingDetail/BookingDetail";
import TicketDetail from "./components/pages/TicketDetail/TicketDetail";
import MovieList from "./components/pages/MovieList/MovieList";
import MovieDetail from "./components/pages/MovieDetail/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PurchaseTickets />} />
        <Route path="/ticket" element={<TicketList />} />
        <Route path="/movie" element={<MovieList />} />
        <Route path="/booking" element={<BookingList />} />
        <Route path="/ticket/:ticketId" element={<TicketDetail />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/booking/:bookingId" element={<BookingDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
