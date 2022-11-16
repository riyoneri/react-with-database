import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';


function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(() => {
    setIsLoading(true)
    setError(null)
    fetch('/movies')
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong!')
        }
        return res.json()
      })
      .then(data => {
        const transformedMovies = data.movies.map(movieData => {
          return {
            id: movieData._id,
            title: movieData.title,
            openingText: movieData.openingText,
            releaseDate: movieData.releaseDate
          }
        })
        setMovies(transformedMovies)
      })
      .catch(err => {
        setError(err.message)
      })
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

  const addMovieHandler = (movie) => {
    fetch('/add-movie', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("'Something went wrong!'")
        }
        return res.json()
      })
      .then(data => console.log(data))
      .catch(err => {
        setError(err.message)
      })
  }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if (error) {
    content = <p>{error}</p>
  }

  if (isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
