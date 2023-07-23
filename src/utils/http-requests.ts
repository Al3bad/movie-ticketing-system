import { BASE_API_ENDPOINT } from "./constants";
import { UpdateMovie } from "../../common/validations";

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
    const response = { status: err.response.status };
    switch (err.response.status) {
      case 400:
        throw {
          ...response,
          message: "Bad Request",
        };
      case 401:
        throw {
          ...response,
          message: "Unauthorized",
        };
      case 404:
        throw {
          ...response,
          message: "Page Not Found",
        };
      case 500:
        throw {
          ...response,
          message: "Internal Server Error",
        };
      default:
        throw {
          ...response,
          message: "Fail to load data",
        };
    }
  } else {
    throw {
      message: "An error occurred",
    };
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
    const response = await httpFetch(customer_endpoint, {
      ...getHTTPHeader("put"),
      body: JSON.stringify(updatedInfo),
    });
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

export const updateMovie = async (title: string, data: UpdateMovie) => {
  const movies_endpoint = `${BASE_API_ENDPOINT}/movie/${title}`;
  try {
    const response = await httpFetch(movies_endpoint, {
      ...getHTTPHeader("put"),
      body: JSON.stringify(data),
    });
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
