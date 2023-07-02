import { useState, useEffect } from "react";
import {
  fetchCustomer,
  fetchMovies,
  fetchTickets,
  submitBooking,
} from "../../../utils/http-requests";
import { NewBookingSchema } from "../../../../common/validations";
import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";
import MultipleInputs from "../../UI/MultipleInputs/MultipleInputs";
import Input from "../../UI/Input/Input";
import Icon from "../../UI/Icon/Icon";
import styles from "./PurchaseTickets.module.css";

const PurchaseTickets = () => {
  // TO DO: NEED TO REMOVE ONCE BACKEND IS READY
  const DUMMY_CUSTOMER_TYPES = [
    {
      id: 1,
      value: "Normal",
    },
    {
      id: 2,
      value: "Flat",
    },
    {
      id: 3,
      value: "Step",
    },
  ];

  const DUMMY_MOVIES = [
    {
      id: 1,
      value: "Avatar",
    },
    {
      id: 2,
      value: "Avengers",
    },
    {
      id: 3,
      value: "Star War",
    },
  ];
  const DUMMY_TICKETS = [
    {
      id: 1,
      value: "Student",
    },
    {
      id: 2,
      value: "Senior",
    },
    {
      id: 3,
      value: "Concession",
    },
  ];
  //----
  type Customer = {
    email: string;
    name: string;
    type: string;
  };
  type Movie = {
    title: string;
  };
  type Ticket = { name: string; price: number };
  type SelectedTicket = {name: string, qty: number}
  type SelectedTickets = SelectedTicket[];

  const [customer, setCustomer] = useState<Customer>(); // {email: "", name: "", type: ""}
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Ticket[]>([]);
  const [isCustomerFetched, setIsCustomerFetched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string>();
  const [selectedTicket, setSelectedTicket] = useState<SelectedTicket>();
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>([]);

  useEffect(() => {
    // Fetch Movies on Page Load
    fetchMovies()
      .then((movies) => {
        // TO DO: transform data based on reponse from Backend before setMovies
        setMovies(movies);
      })
      .catch((error) => console.log(error));

    // Fetch Ticket Types on Page Load
    fetchTickets()
      .then((tickets) => {
        // TO DO: transform data based on reponse from Backend before setTicketTypes
        setTicketTypes(tickets);
      })
      .catch((error) => console.log(error));
  }, []);

  // TO DO: Check customer response in the case of new customer
  const fetchCustomerHandler = (email: string) => {
    console.log("fetch customer...", email);

    // TO DO: move this line after receiving response from backend
    setIsCustomerFetched(true);
    fetchCustomer(email)
      .then((customer) => {
        // TO DO: transform data based on reponse from Backend before setCustomer
        setCustomer(customer);
      })
      .catch((error) => console.log(error));
  };

  const inputChangeHandler = (label: string, val: string | number) => {
    console.log(label, val);

    // FOR TESTING ONLY REMOVE ONCE BACKEND IS READY
    if (label === "Customer Name") {
      setCustomer((currentVals) => {
        return {
          ...currentVals,
          name: val,
        };
      });
    } else if (label === "Customer Type") {
      setCustomer((currentVals) => {
        return {
          ...currentVals,
          type: val,
        };
      });
    }
    //----

    if (label === "Customer Email input") {
      setCustomer((currentVals) => {
        return {
          ...currentVals,
          email: val,
        };
      });
    } else if (label === "Tickets option") {
      setSelectedTicket((currentVals) => {
        return {
          ...currentVals,
          type: val
        };
      });
    } else if (label === "Tickets input") {
      setSelectedTicket((currentVals) => {
        return {
          ...currentVals,
          qty: +val,
        };
      });
    } else if (label === "Movie") {
      setSelectedMovie(val);
    }
  };

  const addNewTicketsHandler = (data) => {
    setSelectedTickets((currentVals) => {
      return [...currentVals, selectedTicket]
    });
    console.log(data);
  };

  const purchaseTicketHandler = (event) => {
    event.preventDefault();
    // TO DO: Add funtionality to purchase ticket
    const newBooking = {
      name: customer?.name,
      email: customer?.email,
      type: customer?.type,
      movie: selectedMovie,
      tickets: selectedTickets.length === 0? [selectedTicket] : selectedTickets
    };

    console.log(newBooking);

    // Validate form input
    const result = NewBookingSchema.safeParse(newBooking);

    if (result.success) {
      // send data to the backend
      console.log(result);
    } else {
      // display errors on the form
      result.error.issues.forEach((error) => {
        console.log(error.path, error.message);
      });
    }
  };

  return (
    <div className={styles["purchase-tickets"]}>
      <div
        className={`${styles["purchase-tickets"]} ${styles["purchase-tickets__block"]}`}
      >
        <h2 className={styles["purchase-tickets__title"]}>Purchase Tickets</h2>

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
            options={DUMMY_MOVIES}
            onInputChange={inputChangeHandler}
          />

          <MultipleInputs
            label="Tickets"
            options={DUMMY_TICKETS}
            type="dropdown-w-input"
            onInputChange={inputChangeHandler}
          />

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
