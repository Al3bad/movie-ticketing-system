import { BASE_API_ENDPOINT } from "./constants";

const post_header = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    }
}

export const fetchCustomer = async (email: string) => {
    const customer_endpoint = `${BASE_API_ENDPOINT}/customer/${email}`;
    try {
        const response = await fetch(customer_endpoint);
        return response.json();
    } catch (error) {
        return error;
    }
}

export const fetchMovies = async () => {
    const movies_endpoint = `${BASE_API_ENDPOINT}/movie`;
    try {
        const response = await fetch(movies_endpoint)
        return response.json();
    } catch (error) {
        return error
    }
}

export const fetchTickets = async () => {
    const tickets_endpoint = `${BASE_API_ENDPOINT}/tickets`;
    try {
        const response = await fetch(tickets_endpoint);
        return response.json();
    } catch (error) {
        return error;
    }
}

export const submitBooking = async (data) => {
    const purchase_ticket_endpoint = `${BASE_API_ENDPOINT}/booking`;
    try {
        const response = await fetch(purchase_ticket_endpoint, {
            ...post_header,
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (error) {
        return error;
    }
}