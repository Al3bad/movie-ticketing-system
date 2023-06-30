import Button from "../../UI/Button/Button";

const PurchaseTickets = () => {

    const purchaseTicketHandler = (event) => {
        event.preventDefault();
        // TO DO: Add funtionality to purchase ticket
    };



    return (
        <form onSubmit={purchaseTicketHandler}>
            <Button type="submit" classLabel="primary">Purchase</Button>
        </form>
    );
}

export default PurchaseTickets;
