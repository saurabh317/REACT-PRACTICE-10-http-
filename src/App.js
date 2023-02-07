import React from "react";
import AddMovie from "./components/AddMovie";
import { useState, useCallback, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(
        `https://react-http-9e9cc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json`
      );
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const data = await response.json();

      const loadedMovies = [];

      // eslint-disable-next-line no-lone-blocks
      for(const key in data){{
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseData:data[key].releaseData

        });
      }
    }


      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseData: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);


  async function addMovieHandler(movie) {
    const response = await fetch(
      `https://react-http-9e9cc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json`,
      { method: "POST" ,
        body:JSON.stringify(movie),
        headers:{
          'Content-Type':'application/json'
        }}
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>movies not found</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
