import { useLoaderData } from "react-router-dom";
import { fetchBookings } from "../../../utils/http-requests";
import Table from "../../UI/Table/Table";

const table_headers = [
  { title: "Id", key: "id" },
  { title: "Name", key: "name" },
  { title: "Movie", key: "movie" },
  { title: "Email", key: "email" },
  { title: "Total", key: "totalTicketPrice" },
];

const BookingList = () => {
  const bookings = useLoaderData();
  return (
    <>
      <Table
        headers={table_headers}
        values={bookings}
        id="id"
        path="booking"
      ></Table>
    </>
  );
};

export default BookingList;

export const bookingListLoader = async () => {
  const bookingList = await fetchBookings();
  if (bookingList) {
    const bookingValues = bookingList.map((booking) => {
      return {
        id: booking.id,
        email: booking.customer.email,
        name: booking.customer.name,
        movie: booking.title,
        totalTicketPrice: `$${booking.totalTicketPrice}`,
      };
    });
    return bookingValues;
  }
};
