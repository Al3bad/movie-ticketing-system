import { useState, useEffect } from "react";
import { fetchBookings } from "../../../utils/http-requests";
import Table from "../../UI/Table/Table";

const table_headers = [
  { title: "Id", key: "id" },
  { title: "Name", key: "name" },
  { title: "Movie", key: "movie" },
  { title: "Email", key: "email" },
  { title: "Ticket Qty", key: "qty" },
];

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookingHandler();
  }, []);

  const fetchBookingHandler = async () => {
    const bookingList = await fetchBookings();
    if (bookingList) {
      const bookingValues = bookingList.map((booking: Booking) => {
        return {
          id: booking.id,
          email: booking.customer.email,
          name: booking.customer.name,
          movie: booking.title,
          qty: getTicketQty(booking),
        };
      });
      setBookings(bookingValues);
    }
  };

  const getTicketQty = (booking: Booking) => {
    const ticketQties = booking.tickets.map((ticket) => ticket.qty);
    const sumTicketQty = ticketQties.reduce(
      (sum: number, qty: number) => sum + qty
    );
    return sumTicketQty;
  };

  return (
    <>
      <Table
        headers={table_headers}
        values={bookings}
        id="id"
        path="/bookings"
      ></Table>
    </>
  );
};

export default BookingList;
