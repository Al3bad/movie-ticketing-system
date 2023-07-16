import { useLoaderData } from "react-router-dom";
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
  const customers = useLoaderData();
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

export const customerListLoader = async () => {
  const customerList = await fetchCustomers();
  if (customerList) {
    return customerList;
  }
};
