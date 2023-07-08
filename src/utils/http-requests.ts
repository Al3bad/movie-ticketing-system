import { BASE_API_ENDPOINT } from "./constants";

const post_header = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

// create custom ResponseError
class ResponseError extends Error {
  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

// Create a wrapper to handle errors for all http requests
const httpFetch = async (...options) => {
  try {
    const res = await fetch(...options);
    if (!res.ok) {
      throw new ResponseError("Fail to load data", res);
    }
    return res;
  } catch (err) {
    switch (err.response.status) {
      case 400:
        console.log("Bad Request");
        break;
      case 401:
        console.log("Unauthorized");
        break;
      case 404:
        console.log("Page Not Found");
        break;
      case 500:
        console.log("Internal Server Error");
        break;
      default:
        console.log(err);
    }
  }
};

export const fetchCustomerByEmail = async (email: string) => {
  const customer_endpoint = `${BASE_API_ENDPOINT}/customer/${email}`;
  const response = await httpFetch(customer_endpoint);
  if (response) {
    return response.json();
  }
};

export const fetchCustomers = async () => {
  const customer_endpoint = `${BASE_API_ENDPOINT}/customer/`;
  const response = await httpFetch(customer_endpoint);
  if (response) {
    return response.json();
  }
};

export const fetchMovies = async () => {
  const movies_endpoint = `${BASE_API_ENDPOINT}/movie/`;
  const response = await httpFetch(movies_endpoint);
  if (response) {
    return response.json();
  }
};

export const fetchTickets = async () => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/ticket/`;
  const response = await fetch(tickets_endpoint);
  if (response) {
    return response.json();
  }
};

export const fetchBookings = async () => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/booking/`;
  const response = await fetch(tickets_endpoint);
  if (response) {
    return response.json();
  }
};

export const fetchBookingById = async (id: number) => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/booking/${id}`;
  const response = await fetch(tickets_endpoint);
  if (response) {
    return response.json();
  }
};

export const submitBooking = async (data) => {
  const purchase_ticket_endpoint = `${BASE_API_ENDPOINT}/booking`;
  const response = await fetch(purchase_ticket_endpoint, {
    ...post_header,
    body: JSON.stringify(data),
  });
  if (response) {
    return response.json();
  }
};
