import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCustomerByEmail } from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const inputFields = [
  {
    label: "Customer Name",
    type: "text",
    key: "name",
  },
  {
    label: "Customer Email",
    type: "text",
    key: "email",
  },
  {
    label: "Customer Type",
    type: "text",
    key: "type",
  },
  {
    label: "Discount Rate",
    type: "number",
    key: "discountRate",
  },
  {
    label: "Threshold",
    type: "number",
    key: "threshold",
  },
];

const initialData = {
  discountRate: 0,
  email: "",
  name: "",
  threshold: 0,
  type: "",
};

const CustomerDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState(initialData);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userEmail = queryParams.get("id");
    if (userEmail) {
      fetchCustomerHandler(userEmail);
    }
  }, []);

  const fetchCustomerHandler = async (email: string) => {
    const customer = await fetchCustomerByEmail(email);
    console.log(customer);
    setCustomer(customer);
  };

  const inputChangeHandler = (val) => {
    console.log(val);
  };

  const editCustomerHandler = () => {
    setIsEdit((currentVal) => !currentVal);
  };

  return (
    <>
      <form>
        {inputFields.map((field, id) => (
          <Input
            key={id}
            isDisabled={!isEdit}
            label={field.label}
            type={field.type}
            onChange={inputChangeHandler}
            value={customer[field.key]}
          />
        ))}
        <Button
          label="Edit"
          type="submit"
          onClick={editCustomerHandler}
          classLabels={["primary"]}
        />
      </form>
    </>
  );
};

export default CustomerDetail;
