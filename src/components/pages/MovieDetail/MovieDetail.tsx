import { useState } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import { fetchMovieByTitle, updateMovie } from "../../../utils/http-requests";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import { UpdateMovieSchema } from "../../../../common/validations";

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
  const [updatedMovie, setUpdatedMovie] = useState(movie);

  const inputChangeHandler = (label, val) => {
    const fieldKey = inputFields.filter((field) => field.label === label);
    console.log(label, val);
    console.log(fieldKey);
    setUpdatedMovie((currentVal) => {
      return {
        ...currentVal,
        [fieldKey[0].key]: val,
      };
    });
  };

  return (
    <>
      {movie && (
        <Form method="put">
          {inputFields.map((field, id) => {
            return (
              <Input
                key={id}
                label={field.label}
                isDisabled={field.key === "seatAvailable" ? true : false}
                type={field.type}
                name={field.key}
                onChange={inputChangeHandler}
                value={updatedMovie[field.key]}
              />
            );
          })}
          <Button label="Update" type="submit" classLabels={["primary"]} />
        </Form>
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

export const movieDetailAction = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("id");
  const formInput = await request.formData();
  const data = {
    title: formInput.get("title"),
  };
  // Validate data
  const validateResult = UpdateMovieSchema.safeParse(data);
  if (validateResult.success && title) {
    try {
      const response = await updateMovie(title, data);
      if (response) {
        return redirect("/movies");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return validateResult;
  }
};
