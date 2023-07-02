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
import { ZodStringCheck } from "zod";

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
  type Ticket = { type: string; price: number };
  type SelectedTicket = { type: string; qty: number };
  type SelectedTickets = SelectedTicket[];
  type Data = {
    movies: Movie[],
    ticketTypes: Ticket[],
    customer: Customer,
    selectedMovie: string,
    selectedTicket: SelectedTicket
  };

  const initialData = {
    movies: [], 
    ticketTypes: [], 
    customer: {email: "", name: "", type: ""}, 
    selectedMovie: "", 
    selectedTicket: {type: "", qty: 0}
  }
  const [data, setData] = useState<Data>(initialData);
  const [isCustomerFetched, setIsCustomerFetched] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>([]);

  useEffect(() => {
    // Fetch Movies on Page Load
    fetchMovies()
      .then((movies) => {
        // TO DO: transform data based on reponse from Backend before setMovies
        setData((currentData) => {
          return {
            ...currentData,
            movies: movies
          }
        });
      })
      .catch((error) => console.log(error));

    // Fetch Ticket Types on Page Load
    fetchTickets()
      .then((tickets) => {
        // TO DO: transform data based on reponse from Backend before setTicketTypes
        setData((currentData) => {
          return {
            ...currentData,
            tickets: tickets
          }
        });
      })
      .catch((error) => console.log(error));
  }, []);

  // TO DO: Check customer response in the case of new customer
  const fetchCustomerHandler = (email: string) => {
    // TO DO: move this line after receiving response from backend
    setIsCustomerFetched(true);
    fetchCustomer(email)
      .then((customer) => {
        // TO DO: transform data based on reponse from Backend before setCustomer
        setData((currentVals) => {
          return {
            ...currentVals,
            customer: customer
          }
        });
      })
      .catch((error) => console.log(error));
  };

  const inputChangeHandler = (label: string, val: string) => {
    console.log(label, val);

    // FOR TESTING ONLY REMOVE ONCE BACKEND IS READY
    if (label === "Customer Name") {
      setData((currentVals) => {
        const currentCustomer = currentVals.customer;
        return {
          ...currentVals,
          customer: {
            name: val,
            email: currentCustomer.email,
            type: currentCustomer.type
          }
        };
      });
    } else if (label === "Customer Type") {
      setData((currentVals) => {
        const currentCustomer = currentVals.customer;
        return {
          ...currentVals,
          customer: {
            email: currentCustomer.email,
            name: currentCustomer.name,
            type: val
          }
        };
      });
    }
    //----
    switch (label) {
      case "Customer Email input":
        return setData((currentVals) => {
          const currentCustomer = currentVals.customer; 
          return {
            ...currentVals,
            customer: {
              name: currentCustomer.name,
              type: currentCustomer.type,
              email: val
            }
          };
        });
      case "Tickets option":
        return setData((currentVals) => {
          const currentTicket = currentVals.selectedTicket;
          return {
            ...currentVals,
            selectedTicket: {
              type: val,
              qty: currentTicket.qty
            }
          };
        });
      case "Tickets input":
        return setData((currentVals) => {
          const currentTicket = currentVals.selectedTicket;
          return {
            ...currentVals,
            selectedTicket: {
              type: currentTicket.type,
              qty: +val,
            }
          };
        });
      case "Movie":
        return setData((currentVals) => {
          return {
            ...currentVals,
            selectedMovie: val
          }
        });
      default:
        return;
    }
  };

  const addNewTicketsHandler = (data) => {
    setSelectedTickets((currentVals) => {
      return [...currentVals, data.selectedTicket];
    });
    console.log(data);
  };

  const purchaseTicketHandler = (event) => {
    event.preventDefault();
    // TO DO: Add funtionality to purchase ticket
    const newBooking = {
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        type: data.customer.type,
      },
      movie: data.selectedMovie,
      tickets:
        selectedTickets.length === 0 ? [data.selectedTicket] : selectedTickets,
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
