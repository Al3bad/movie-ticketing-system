import { useState, useEffect } from "react";
import { fetchCustomers } from "../../../utils/http-requests";
import Table from "../../UI/Table/Table";

const table_headers = [
  {
    title: "Name",
    key: "name",
  },
  { title: "Type", key: "type" },
  { title: "Email", key: "email" },
  { title: "Discount Rate", key: "discountRate" },
  { title: "Threshold", key: "threshold" },
];

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerHandler();
  }, []);

  const fetchCustomerHandler = async () => {
    const customerList = await fetchCustomers();
    if (customerList) {
      setCustomers(customerList);
    }
  };
  return (
    <Table
      headers={table_headers}
      values={customers}
      id="email"
      path="customer"
    ></Table>
  );
};
export default CustomerList;
