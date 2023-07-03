import { useState, useEffect } from "react";

import styles from "./PurchaseTickets.module.css";
import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";
import MultipleInputs from "../../UI/MultipleInputs/MultipleInputs";
import Input from "../../UI/Input/Input";
import Message from "../../UI/Message/Message";
import Icon from "../../UI/Icon/Icon";
import {
  fetchCustomer,
  fetchMovies,
  fetchTickets,
  submitBooking,
} from "../../../utils/http-requests";
import { NewBookingSchema } from "../../../../common/validations";

type Customer = { name: string; email: string; type: string };
type Data = {
  movies: NewMovie[];
  ticketTypes: NewTicket[];
  customer: Customer;
  selectedMovie: string;
  selectedTickets: Ticket[];
};
type Msg = {
  type: "error" | "success";
  text: string;
};

const PurchaseTickets = () => {
  // TO DO: NEED TO REMOVE ONCE BACKEND IS READY
  const DUMMY_CUSTOMER_TYPES = [
    {
      id: 1,
      value: "Normal",
    },
  ];
  //----

  const initialData = {
    movies: [],
    ticketTypes: [],
    customer: { email: "", name: "", type: "" },
    selectedMovie: "",
    selectedTickets: [{ type: "", qty: 0 }],
  };

  const [data, setData] = useState<Data>(initialData);
  const [isCustomerFetched, setIsCustomerFetched] = useState(false);
  const [ticketInputIds, setTicketInputIds] = useState([0]);
  const [msg, setMsg] = useState<Msg>();

  useEffect(() => {
    // Fetch Movies on Page Load
    fetchMovies()
      .then((movies) => {
        const movieOptions = movies.map((movie: NewMovie) => {
          return { ...movies, id: movie.title, value: movie.title };
        });
        setData((currentData) => {
          return {
            ...currentData,
            movies: movieOptions,
          };
        });
      })
      .catch((error) => console.log(error));

    // Fetch Ticket Types on Page Load
    fetchTickets()
      .then((tickets) => {
        const ticketOptions = tickets.map((ticket: NewTicket) => {
          return {
            ...ticket,
            id: ticket.type,
            value: ticket.type,
          };
        });
        setData((currentData) => {
          return {
            ...currentData,
            ticketTypes: ticketOptions,
          };
        });
      })
      .catch((error) => console.log(error));
  }, []);

  // TO DO: Check customer response in the case of new customer
  const fetchCustomerHandler = () => {
    // TO DO: move this line after receiving response from backend
    setIsCustomerFetched(true);
    if (data.customer.email) {
      fetchCustomer(data.customer.email)
        .then((customer) => {
          // TO DO: transform data based on reponse from Backend before setCustomer
          setData((currentVals) => {
            return {
              ...currentVals,
              customer: customer,
            };
          });
        })
        .catch((error) => console.log(error));
    }
  };

  const inputChangeHandler = (label: string, val: string, id = -1) => {
    // FOR TESTING ONLY REMOVE ONCE BACKEND IS READY
    if (label === "Customer Name") {
      setData((currentVals) => {
        const currentCustomer = { ...currentVals.customer };
        currentCustomer.name = val;
        return {
          ...currentVals,
          customer: currentCustomer,
        };
      });
    } else if (label === "Customer Type") {
      setData((currentVals) => {
        const currentCustomer = { ...currentVals.customer };
        currentCustomer.type = val;
        return {
          ...currentVals,
          customer: currentCustomer,
        };
      });
    }
    //----
    switch (label) {
      case "Customer Email input":
        return setData((currentVals) => {
          const currentCustomer = { ...currentVals.customer };
          currentCustomer.email = val;
          return {
            ...currentVals,
            customer: currentCustomer,
          };
        });
      case "Tickets option":
        return setData((currentVals) => {
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
      case "Tickets input":
        return setData((currentVals) => {
          const currentTickets = [...currentVals.selectedTickets];
          if (id >= 0) {
            currentTickets[id].qty = +val;
            console.log(currentTickets);
            return {
              ...currentVals,
              selectedTickets: currentTickets,
            };
          }
          return currentVals;
        });
      case "Movie":
        return setData((currentVals) => {
          return {
            ...currentVals,
            selectedMovie: val,
          };
        });
      default:
        return;
    }
  };

  const addNewTicketsHandler = () => {
    setTicketInputIds((currentIds) => [...currentIds, currentIds.length]);
    setData((currentVals) => {
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
        name: data.customer.name,
        email: data.customer.email,
        type: data.customer.type,
      },
      movie: data.selectedMovie,
      tickets: data.selectedTickets.filter(
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
        <h2 className={styles["purchase-tickets__title"]}>Purchase Tickets</h2>
        {msg && <Message msg={msg.text} type={msg.type} />}

        <form onSubmit={purchaseTicketHandler}>
          <MultipleInputs
            label="Customer Email"
            type="input-w-btn"
            onButtonClick={fetchCustomerHandler}
            onInputChange={inputChangeHandler}
          />

          {/* Display Customer name and type only when customer info is fetched */}
          {isCustomerFetched && (
            <>
              {/* 
              TO DO: 
                Fetch Customer Name from Backend, 
                Set disabled state based on customer response info 
              */}
              <Input
                label="Customer Name"
                type="text"
                onInputChange={inputChangeHandler}
              />

              {/* 
              TO DO: 
                Fetch Customer Types from Backend, 
                Replace DUMMY data,
                Set disabled state based on customer response info 
              */}
              <Dropdown
                label="Customer Type"
                options={DUMMY_CUSTOMER_TYPES}
                onInputChange={inputChangeHandler}
              />
            </>
          )}

          {/* 
          TO DO: 
            Fetch Movies from Backend,
            Replace DUMMY data 
          */}
          <Dropdown
            label="Movie"
            options={data.movies}
            onInputChange={inputChangeHandler}
          />

          <p>Tickets</p>
          {/* Dynamically generate a list of ticket inputs */}
          {ticketInputIds.map((id) => (
            <MultipleInputs
              key={id}
              label="Tickets"
              hide_label={true}
              options={data.ticketTypes}
              type="dropdown-w-input"
              onInputChange={(label: string, val: string) =>
                inputChangeHandler(label, val, id)
              }
            />
          ))}

          <Button
            type="button"
            label="Add New Ticket"
            classLabels={["secondary", "secondary--icon"]}
            onButtonClick={addNewTicketsHandler}
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
