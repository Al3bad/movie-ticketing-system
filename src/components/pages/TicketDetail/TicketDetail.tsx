import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchTicketByType } from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const inputFields = [
  {
    label: "Ticket Type",
    type: "text",
    key: "type",
  },
  {
    label: "Price",
    type: "number",
    key: "price",
  },
];

const TicketDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const ticket = useLoaderData();

  const inputChangeHandler = (val) => {
    console.log(val);
  };

  const editTicketHandler = () => {
    setIsEdit((currentVal) => !currentVal);
  };
  return (
    <>
      {ticket && (
        <form>
          {inputFields.map((field, id) => {
            return (
              <Input
                key={id}
                isDisabled={field.key === "type" ? true : !isEdit}
                label={field.label}
                type={field.type}
                onChange={inputChangeHandler}
                value={ticket[field.key]}
              />
            );
          })}
          {/* <Button
            label="Edit"
            type="button"
            onClick={editTicketHandler}
            classLabels={["primary"]}
          /> */}
        </form>
      )}
    </>
  );
};

export default TicketDetail;

export const ticketDetailLoader = async ({ request }) => {
  const url = new URL(request.url);
  const ticketType = url.searchParams.get("id");
  if (ticketType) {
    const ticket = await fetchTicketByType(ticketType);
    return ticket;
  }
};
