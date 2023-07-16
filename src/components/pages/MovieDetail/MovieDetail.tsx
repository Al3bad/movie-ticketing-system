import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const [movie, setMovie] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const params = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(params.search);
    const title = query.get("id");
    if (title) {
      fetchMovieHandler(title);
    }
  }, []);

  const fetchMovieHandler = async (title: string) => {
    const fetchedMovie = await fetchMovieByTitle(title);
    if (fetchedMovie) {
      setMovie(fetchedMovie);
    }
  };

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
