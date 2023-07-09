import { useState, useEffect } from "react";
import { fetchMovies } from "../../../utils/http-requests";
import Layout from "../../UI/Layout/Layout";
import Table from "../../UI/Table/Table";

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
  return (
    <Layout title="Movies">
      <Table type="movie" values={movies}></Table>;
    </Layout>
  );
};

export default MovieList;
