import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchMovieByTitle } from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const inputFields = [
  {
    label: "Movie Title",
    key: "title",
    type: "text",
  },
  {
    label: "Seat Available",
    key: "seatAvailable",
    type: "number",
  },
];

const MovieDetail = () => {
  const movie = useLoaderData();
  const [isEdit, setIsEdit] = useState(false);

  const inputChangeHandler = (e) => {
    console.log(e);
  };

  const editMovieHandler = () => {
    // Toggle the current edit state
    setIsEdit((currentState) => !currentState);
  };

  return (
    <>
      {movie && (
        <form>
          {inputFields.map((field, id) => {
            return (
              <Input
                key={id}
                isDisabled={!isEdit}
                label={field.label}
                type={field.type}
                onChange={inputChangeHandler}
                value={movie[field.key]}
              />
            );
          })}
          {/* <Button
            label={!isEdit ? "Edit" : "Save"}
            type="button"
            onClick={editMovieHandler}
            classLabels={["primary"]}
          /> */}
        </form>
      )}
    </>
  );
};

export default MovieDetail;

export const movieDetailLoader = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("id");
  if (title) {
    const fetchedMovie = await fetchMovieByTitle(title);
    return fetchedMovie;
  }
};
