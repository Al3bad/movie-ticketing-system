import { useEffect, useState } from "react";

const inputFields = [
  {
    title: "Title",
    key: "title",
  },
  {
    title: "Seat Available",
    key: "seatAvailable",
  },
  {
    title: "Is Released",
    key: "isReleased",
  },
];

const MovieDetail = () => {
  return (
    <>
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

export default MovieDetail;
