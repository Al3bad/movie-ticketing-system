import { BASE_API_ENDPOINT } from "./constants";

const getHTTPHeader = (method: string) => {
  const header = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return header;
};

// create custom ResponseError
class ResponseError extends Error {
  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

const errorHandler = (err) => {
  if (err.response && err.response.status) {
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
        console.log("other handled errors", err);
    }
  } else {
    console.log(err);
  }
};

// Create a wrapper to handle errors for all http requests
const httpFetch = async (...options) => {
  const res = await fetch(...options);
  if (!res.ok) {
    throw new ResponseError("Fail to load data", res);
  }
  return res;
};

export const fetchCustomerByEmail = async (email: string) => {
  const customer_endpoint = `${BASE_API_ENDPOINT}/customer/${email}`;
  try {
    const response = await httpFetch(customer_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const fetchCustomers = async () => {
  const customer_endpoint = `${BASE_API_ENDPOINT}/customer/`;
  try {
    const response = await httpFetch(customer_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const updateCustomer = async (email: string, updatedInfo) => {
  const customer_endpoint = `${BASE_API_ENDPOINT}/customer/${email}`;
  try {
    const data = {
      ...getHTTPHeader("put"),
      body: JSON.stringify(updatedInfo),
    };
    console.log(data);
    const response = await httpFetch(customer_endpoint, data);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const fetchMovies = async () => {
  const movies_endpoint = `${BASE_API_ENDPOINT}/movie/`;
  try {
    const response = await httpFetch(movies_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const fetchMovieByTitle = async (title: string) => {
  const movies_endpoint = `${BASE_API_ENDPOINT}/movie/${title}`;
  try {
    const response = await httpFetch(movies_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const fetchTickets = async () => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/ticket/`;
  try {
    const response = await fetch(tickets_endpoint);
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const fetchTicketByType = async (type: string) => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/ticket/${type}`;
  try {
    const response = await fetch(tickets_endpoint);
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
export const fetchBookings = async () => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/booking/`;
  try {
    const response = await fetch(tickets_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const fetchBookingById = async (id: number) => {
  const tickets_endpoint = `${BASE_API_ENDPOINT}/booking/${id}`;
  try {
    const response = await fetch(tickets_endpoint);
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};

export const submitBooking = async (data) => {
  const purchase_ticket_endpoint = `${BASE_API_ENDPOINT}/booking`;
  try {
    const response = await fetch(purchase_ticket_endpoint, {
      ...getHTTPHeader("post"),
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    errorHandler(err);
  }
};
