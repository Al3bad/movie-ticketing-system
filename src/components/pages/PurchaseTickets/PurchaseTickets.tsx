import Button from "../../UI/Button/Button";
import Dropdown from "../../UI/Dropdown/Dropdown";

const PurchaseTickets = () => {

    const purchaseTicketHandler = (event) => {
        event.preventDefault();
        // TO DO: Add funtionality to purchase ticket
    };


    return (
        <form onSubmit={purchaseTicketHandler}>
            {/* TO DO: Fetch Customer Types from Backend */}
            <Dropdown label="Customer Type" options={["General", "Reward Flat", "Reward Step"]}></Dropdown>
            {/* TO DO: Fetch Movies from Backend */}
            <Dropdown label="Movie" options={["Avatar", "Star War", "Avengers"]}></Dropdown>
            <Button type="submit" classLabel="primary">Purchase</Button>
        </form>
    );
}

export default PurchaseTickets;
