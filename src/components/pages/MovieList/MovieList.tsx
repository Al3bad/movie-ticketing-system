import { useState, useEffect } from "react";
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
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovieHandler();
  }, []);

  const fetchMovieHandler = async () => {
    const movieList = await fetchMovies();
    if (movieList) {
      setMovies(movieList);
    }
  };
  return <Table headers={table_headers} values={movies}></Table>;
};

export default MovieList;
