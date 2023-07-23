import { useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import styles from "./PurchaseTickets.module.css";
import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";
import MultipleInputs from "../../UI/MultipleInputs/MultipleInputs";
import Input from "../../UI/Input/Input";
import Message from "../../UI/Message/Message";
import Icon from "../../UI/Icon/Icon";
import {
  fetchCustomerByEmail,
  fetchMovies,
  fetchTickets,
  submitBooking,
} from "../../../utils/http-requests";
import { NewBookingSchema } from "../../../../common/validations";

type Data = {
  movies: Movie[];
  ticketTypes: Ticket[];
  "customer-name": string;
  "customer-type": string;
  "customer-email-input": string;
  movie: string;
  selectedTickets: Ticket[];
};

type Msg = {
  type: "error" | "success";
  text: string;
};

const PurchaseTickets = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const data = useLoaderData();

  const initialData = {
    movies: data.movies,
    ticketTypes: data.ticketTypes,
    "customer-name": "",
    "customer-type": "",
    "customer-email-input": "",
    movie: "",
    selectedTickets: [{ type: "", qty: 0 }],
  };

  const [formInput, setFormInput] = useState<Data>(initialData);
  const [ticketInputIds, setTicketInputIds] = useState([0]);
  const [msg, setMsg] = useState<Msg>();

  const inputChangeHandler = (label: string, val: string, id = -1) => {
    label = label.toLocaleLowerCase().split(" ").join("-");
    switch (label) {
      case "tickets-option":
        return setFormInput((currentVals) => {
          const currentTickets = [...currentVals.selectedTickets];
          if (id >= 0) {
            currentTickets[id].type = val;
            return {
              ...currentVals,
              selectedTickets: currentTickets,
            };
          }
          return currentVals;
        });
      case "tickets-input":
        return setFormInput((currentVals) => {
          const currentTickets = [...currentVals.selectedTickets];
          if (id >= 0) {
            currentTickets[id].qty = +val;
            return {
              ...currentVals,
              selectedTickets: currentTickets,
            };
          }
          return currentVals;
        });
      default:
        return setFormInput((currentVals) => {
          return {
            ...currentVals,
            [label]: val,
          };
        });
    }
  };

  const addNewTicketsHandler = () => {
    setTicketInputIds((currentIds) => [...currentIds, currentIds.length]);
    setFormInput((currentVals) => {
      const currentSelectedTickets = currentVals.selectedTickets;
      return {
        ...currentVals,
        selectedTickets: [...currentSelectedTickets, { type: "", qty: 0 }],
      };
    });
  };

  const purchaseTicketHandler = (event: React.FormEvent) => {
    event.preventDefault();
    // TO DO: Add funtionality to purchase ticket
    const newBooking = {
      customer: {
        name: formInput["customer-name"],
        email: formInput["customer-email-input"],
        type: formInput["customer-type"],
      },
      title: formInput.movie,
      tickets: formInput.selectedTickets.filter(
        (ticket) => ticket.type !== "" && ticket.qty !== 0 // Remove invalid ticket inputs
      ),
    };

    console.log(newBooking);

    // Validate form input
    const result = NewBookingSchema.safeParse(newBooking);

    if (result.success) {
      // send data to the backend
      submitBooking(newBooking)
        .then((response) => console.log("success", response))
        .catch((error) => console.log("error", error));
    } else {
      // display errors on the form
      let msg = "Invalid inputs for: ";
      result.error.issues.forEach((error, idx) => {
        console.log(error.path, error.message);
        if (idx !== result.error.issues.length - 1) {
          msg += error.path[0] + ", ";
        } else {
          msg += error.path[0];
        }
      });
      setMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className={styles["purchase-tickets"]}>
      <div
        className={`${styles["purchase-tickets"]} ${styles["purchase-tickets__block"]}`}
      >
        {msg && <Message msg={msg.text} type={msg.type} />}

        <form onSubmit={purchaseTicketHandler}>
          <Input
            label="Customer Email"
            type="email"
            id="customer-email"
            onChange={inputChangeHandler}
          />

          {/* 
          TO DO: 
            Fetch Movies from Backend,
            Replace DUMMY data 
          */}
          <Dropdown
            label="Movie"
            id="movie"
            options={data.movies}
            onChange={inputChangeHandler}
            value={formInput.movie}
          />

          <p>Tickets</p>
          {/* Dynamically generate a list of ticket inputs */}
          {ticketInputIds.map((id) => {
            return (
              <MultipleInputs
                key={id}
                label="Tickets"
                id="tickets"
                hide_label={true}
                options={data.ticketTypes}
                type="dropdown-w-input"
                onChange={(label: string, val: string) =>
                  inputChangeHandler(label, val, id)
                }
                value={formInput.selectedTickets[id].type}
              />
            );
          })}

          <Button
            type="button"
            id="add-new-ticket"
            classLabels={["secondary", "secondary--icon"]}
            onClick={addNewTicketsHandler}
          >
            <Icon name="add" />
          </Button>

          <Button type="submit" classLabels={["primary"]}>
            Purchase
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseTickets;

export const purchaseTicketLoader = async () => {
  let data = {
    movies: [],
    ticketTypes: [],
  };

  // fetch movies
  const movies = await fetchMovies();
  if (movies) {
    // console.log("movies", movies);
    const movieOptions = movies.map((movie: Movie) => {
      return { ...movies, id: movie.title, value: movie.title };
    });
    data = {
      ...data,
      movies: movieOptions,
    };
  }

  // fetch tickets
  const tickets = await fetchTickets();
  if (tickets) {
    // console.log("tickets", tickets);
    const ticketOptions = tickets.map((ticket: NewTicket) => {
      return {
        ...ticket,
        id: ticket.type,
        value: ticket.type,
      };
    });
    data = {
      ...data,
      ticketTypes: ticketOptions,
    };
  }

  return data;
};
