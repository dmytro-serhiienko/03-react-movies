import { useState, useEffect } from "react";
import css from "./App.module.css";

import { SearchBar } from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../types/movie";
import { fetchMovies } from "../../services/movieService";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query) return;

    const getMovies = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const data = await fetchMovies(query);
        setMovies(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [query]);

  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setMovies([]);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSubmit} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}

      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
