import React from "react";
import { useState, useEffect } from "react";
import styles from "./ShowAllMovies.module.scss";
import ShowMovieGenres from "./ShowMovieGenres";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ShowAllPopularMovies = (props) => {
  const key = "7598462be8b94fc1e04d0e6dd30a782e";

  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([])
  const [searchterm, setSearchterm] = useState(null);

  const fetchPopularMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`
    );
    const items = await data.json();
    setMovies(items.results);
  };
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
      text-decoration: none;
    }
  `;
  


  const addToWatchlist = (movie) => {
    setWatchlist([...watchlist, movie])
    console.log(watchlist)
  }

  return (
    <div className={styles.searchMoviesWrap}>
      <input className={styles.inputSearchField} type="text" placeholder='Search...' onChange={(e) => setSearchterm(e.target.value)} autoFocus />
      <div className={styles.allPopularMovies}>
        {movies
          .filter((value) => {
            if (searchterm === null) {
              return value;
            } else if (
              value.original_title
                .toLowerCase()
                .includes(searchterm.toLowerCase())
            ) {
              return value;
            }
          })
          .map((m) => (
            <div className={styles.allPopularMoviesMovie}>
              <StyledLink to={`movies/${m.id}`} key={m.id}>
                <img
                  src={`https://image.tmdb.org/t/p/original/${m.poster_path}`}
                  alt={m.originalTitle}
                  loading="lazy"
                />
                <p className={styles.originalTitle}>{m.original_title}</p>
              </StyledLink>
              <div className={styles.genreLinkWrap}>
                {m.genre_ids.map((g, i) => (
                  <ShowMovieGenres genreId={g} key={i}/>
                ))}
              </div>
              {/* <button onClick={() => addToWatchlist(m.id)} >Add to watchlist: {m.id}</button> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShowAllPopularMovies;
