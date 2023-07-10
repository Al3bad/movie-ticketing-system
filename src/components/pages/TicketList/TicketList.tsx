import { useState, useEffect } from "react";
import { fetchTickets } from "../../../utils/http-requests";
import Table from "../../UI/Table/Table";

const table_headers = [
  {
    title: "Type",
    key: "type",
  },
  { title: "Price", key: "price" },
];

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTicketHandler();
  }, []);

  const fetchTicketHandler = async () => {
    const ticketList = await fetchTickets();
    if (ticketList) {
      setTickets(ticketList);
    }
  };
  return <Table headers={table_headers} values={tickets}></Table>;
};

export default TicketList;
