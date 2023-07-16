import { useLoaderData } from "react-router-dom";
import { fetchMovies } from "../../../utils/http-requests";
import Table from "../../UI/Table/Table";

const table_headers = [
  {
    title: "Title",
    key: "title",
  },
  { title: "Seat Available", key: "seatAvailable" },
];

const MovieList = () => {
  const movies = useLoaderData();

  return (
    <Table
      headers={table_headers}
      values={movies}
      path="movie"
      id="title"
    ></Table>
  );
};

export default MovieList;

export const movieListLoader = async () => {
  const movieList = await fetchMovies();
  if (movieList) {
    return movieList;
  }
};
