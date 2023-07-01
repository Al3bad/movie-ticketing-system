import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";
import MultipleInputs from "../../UI/MultipleInputs/MultipleInputs";
import Input from "../../UI/Input/Input";
import styles from "./PurchaseTickets.module.css";

const PurchaseTickets = () => {
  const DUMMY_CUSTOMER_TYPES = [
    {
      id: 1,
      value: "General",
    },
    {
      id: 2,
      value: "Reward Flat",
    },
    {
      id: 3,
      value: "Reward Step",
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
  const purchaseTicketHandler = (event) => {
    event.preventDefault();
    // TO DO: Add funtionality to purchase ticket
  };

  return (
    <div className={styles["purchase-tickets"]}>
      <div
        className={`${styles["purchase-tickets"]} ${styles["purchase-tickets__block"]}`}
      >
        <form onSubmit={purchaseTicketHandler}>
          <MultipleInputs
            label="Customer Email"
            type="input-w-btn"
          />
          {/* TO DO: Fetch Customer Name from Backend */}
          <Input label="Customer Name"/>
          {/* TO DO: Fetch Customer Types from Backend */}
          <Dropdown label="Customer Type" options={DUMMY_CUSTOMER_TYPES} />

          {/* TO DO: Fetch Movies from Backend */}
          <Dropdown label="Movie" options={DUMMY_MOVIES} />

          <MultipleInputs
            label="Ticket Types"
            options={DUMMY_TICKETS}
            type="dropdown-w-input"
          />

          <Button type="submit" classLabels={["primary"]}>
            Purchase
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseTickets;
