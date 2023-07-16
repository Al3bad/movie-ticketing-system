import { fetchTickets } from "../../../utils/http-requests";
import { useLoaderData } from "react-router-dom";
import Table from "../../UI/Table/Table";

const table_headers = [
  {
    title: "Type",
    key: "type",
  },
  { title: "Price", key: "price" },
];

const TicketList = () => {
  const tickets = useLoaderData();
  return (
    <Table
      headers={table_headers}
      values={tickets}
      path="ticket"
      id="type"
    ></Table>
  );
};

export default TicketList;

export const ticketListLoader = async () => {
  const ticketList = await fetchTickets();
  if (ticketList) {
    return ticketList;
  }
};
