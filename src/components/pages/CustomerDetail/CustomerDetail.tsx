import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  fetchCustomerByEmail,
  updateCustomer,
} from "../../../utils/http-requests";
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

const CustomerDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const customer = useLoaderData();

  const updateCustomerHandler = async (email, data) => {
    const response = await updateCustomer(email, data);
    console.log(response);
  };

  const inputChangeHandler = (label, val) => {
    console.log(label, val);
    // setCustomer((currentInfo) => {
    //   return { ...currentInfo, discountRate: +val };
    // });
  };

  const editCustomerHandler = (label, e) => {
    e.preventDefault();
    if (!isEdit) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
      console.log(customer);
      const data = { ...customer };
      delete data.name;
      updateCustomerHandler(data.email, data);
    }
  };

  return (
    <>
      {customer && (
        <form>
          {inputFields.map((field, id) => {
            return (
              <Input
                key={id}
                isDisabled={field.key === "discountRate" ? !isEdit : true}
                label={field.label}
                type={field.type}
                onChange={inputChangeHandler}
                value={customer[field.key]}
              />
            );
          })}
          <Button
            label={!isEdit ? "Edit" : "Save"}
            type="button"
            onClick={editCustomerHandler}
            classLabels={["primary"]}
          />
        </form>
      )}
    </>
  );
};

export default CustomerDetail;

export const customerDetailLoader = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("id");
  if (email) {
    const customer = await fetchCustomerByEmail(email);
    return customer;
  }
};
