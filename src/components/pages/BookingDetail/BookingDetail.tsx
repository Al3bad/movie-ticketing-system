import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { fetchBookingById } from "../../../utils/http-requests";
import styles from "./BookingDetail.module.css";

const BookingDetail = () => {
  const bookingDetail = useLoaderData();

  const printBookingKeyValue = (key, value) => {
    return (
      <div className={styles.booking__info}>
        <p>{key}:</p>
        <p>{value}</p>
      </div>
    );
  };

  const printDivider = (type = "long") => {
    return (
      <span
        className={`${styles["booking__divider"]} ${
          styles[`booking__divider--${type}`]
        }`}
      ></span>
    );
  };

  let content = null;
  if (bookingDetail) {
    content = (
      <div className={styles.booking}>
        {printDivider()}
        <p>
          <b>Booking of {bookingDetail.customer.name}</b>
        </p>
        {printDivider()}
        {printBookingKeyValue("Movie", bookingDetail.title)}
        {bookingDetail.tickets.map((ticket, id) => {
          return (
            <div key={id}>
              {printBookingKeyValue("Ticket Type", ticket.type)}
              {printBookingKeyValue("Ticket Unit Price", `$${ticket.price}`)}
              {printBookingKeyValue("Ticket Quantity", ticket.qty)}
              {id < bookingDetail.tickets.length - 1
                ? printDivider("short")
                : ""}
            </div>
          );
        })}
        {printDivider()}
        {printBookingKeyValue("Discount", bookingDetail.customer.discountRate)}
        {printBookingKeyValue("Booking Fee", bookingDetail.bookingFee)}
        {printBookingKeyValue(
          "Total Cost",
          `$${bookingDetail.totalTicketPrice}`
        )}
      </div>
    );
  } else {
    content = <p>No Booking Found</p>;
  }
  return <>{content}</>;
};

export default BookingDetail;

export const bookingDetailLoader = async ({ request }) => {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("id");
  if (bookingId) {
    const booking = await fetchBookingById(+bookingId);
    return booking;
  }
};
