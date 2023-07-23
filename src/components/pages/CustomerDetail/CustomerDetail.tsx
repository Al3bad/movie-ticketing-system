import { useState } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import {
  fetchCustomerByEmail,
  updateCustomer,
} from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import { UpdateCustomerSchema } from "../../../../common/validations";

const inputFields = [
  { label: "Customer Name", key: "name" },
  { label: "Customer Email", key: "email" },
  { label: "Customer Type", key: "type" },
  { label: "Discount Rate", key: "discountRate" },
  { label: "Threshold", key: "threshold" },
];

const CustomerDetail = () => {
  const customer = useLoaderData();
  const [updatedCustomer, setUpdatedCustomer] = useState(customer);

  const inputChangeHandler = (label, val) => {
    setUpdatedCustomer((currentVal) => {
      const fieldKey = inputFields.filter((field) => field.label === label);
      return { ...currentVal, [fieldKey[0].key]: val };
    });
  };

  return (
    <>
      <Form method="put">
        <Input
          label="Customer Name"
          type="text"
          name="name"
          onChange={inputChangeHandler}
          value={updatedCustomer.name}
        />
        <Input
          label="Customer Email"
          type="email"
          onChange={inputChangeHandler}
          name="email"
          value={updatedCustomer.email}
        />
        <Input
          label="Customer Type"
          type="text"
          isDisabled={true}
          onChange={inputChangeHandler}
          name="type"
          value={updatedCustomer.type}
        />
        {updatedCustomer.discountRate && (
          <Input
            label="Discount Rate"
            type="number"
            onChange={inputChangeHandler}
            name="discountRate"
            value={updatedCustomer.discountRate}
          />
        )}
        {updatedCustomer.threshold && (
          <Input
            label="Threshold"
            type="number"
            onChange={inputChangeHandler}
            name="threshold"
            value={updatedCustomer.threshold}
          />
        )}
        <Button label="Update" type="submit" classLabels={["primary"]} />
      </Form>
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

export const customerDetailAction = async ({ request, params }) => {
  const formInput = await request.formData();
  const url = new URL(request.url);
  const currentEmail = url.searchParams.get("id");

  const discountRate = formInput.get("discountRate");
  const threshold = formInput.get("threshold");

  let data = {
    name: formInput.get("name"),
    newEmail: formInput.get("email"),
  };

  if (discountRate) {
    data = { ...data, discountRate: +discountRate };
  }

  if (threshold) {
    data = { ...data, threshold: +threshold };
  }

  // validate form input
  const validateResult = UpdateCustomerSchema.safeParse(data);
  if (validateResult.success && currentEmail) {
    try {
      const response = await updateCustomer(currentEmail, data);
      if (response) {
        return redirect("/customers");
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
