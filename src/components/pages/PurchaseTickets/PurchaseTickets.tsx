import { useState, useEffect } from "react";

import styles from "./PurchaseTickets.module.css";
import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";
import MultipleInputs from "../../UI/MultipleInputs/MultipleInputs";
import Input from "../../UI/Input/Input";
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
  ];
  const DUMMY_TICKETS = [
    {
      id: 1,
      value: "adult",
    },
    {
      id: 2,
      value: "child",
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

  useEffect(() => {
    // Fetch Movies on Page Load
    fetchMovies()
      .then((movies) => {
        // TO DO: transform data based on reponse from Backend before setMovies
        setData((currentData) => {
          return {
            ...currentData,
            movies: movies,
          };
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
            tickets: tickets,
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
        (ticket) => ticket.type !== "" && ticket.qty !== 0
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

          <p>Tickets</p>
          {/* Dynamically generate a list of ticket inputs */}
          {ticketInputIds.map((id) => (
            <MultipleInputs
              key={id}
              label="Tickets"
              hide_label={true}
              options={DUMMY_TICKETS}
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