import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCustomerByEmail } from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Dropdown from "../../UI/Dropdown/Dropdown";
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

const CUSTOMER_TYPES = [
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
        {inputFields.map((field, id) => {
          if (field.label === "Customer Type") {
            return (
              <Dropdown
                key={id}
                label={field.label}
                options={CUSTOMER_TYPES}
                isDisabled={!isEdit}
                value={customer[field.key]}
              />
            );
          } else {
            return (
              <Input
                key={id}
                isDisabled={!isEdit}
                label={field.label}
                type={field.type}
                onChange={inputChangeHandler}
                value={customer[field.key]}
              />
            );
          }
        })}
        <Button
          label="Edit"
          type="button"
          onClick={editCustomerHandler}
          classLabels={["primary"]}
        />
      </form>
    </>
  );
};

export default CustomerDetail;
