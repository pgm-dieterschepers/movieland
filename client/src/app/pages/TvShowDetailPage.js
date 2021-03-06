import React, { useEffect, useState } from 'react'
import { BaseLayout } from '../layouts';
import styles from './MovieDetailPage.module.scss';
import styled from './ReviewPage.module.scss';
import GetCastFromTvShow from '../components/project/GetCastFromTvShow';
import { Link } from "react-router-dom";
import { db, } from '../utilities/firebase';
import { useAuth } from "../contexts/firebase/auth.context";
import Reviews from '../components/project/Reviews';


const TvShowDetailPage = ({ match }) => {
  useEffect(() => {
    fetchTvShow();
    showReviews();
  }, [])


  const { currentUser, signOut } = useAuth();
  // const [tvShowTitle, setTvShowTitle] = useState()
  const [tvShowHeading, setTvShowHeading] = useState()
  const [tvShowReview, setTvShowReview] = useState()
  const [tvShowRating, setTvShowRating] = useState()
  const [tvShow, setTvShow] = useState({});


  const fetchTvShow = async () => {
    const displayMovie = await fetch(`https://api.themoviedb.org/3/tv/${match.params.id}?api_key=7598462be8b94fc1e04d0e6dd30a782e&language=en-US`)
    const tvShow = await displayMovie.json();
    setTvShow(tvShow)
  }

  // sends data to database
  const handleSubmit = (e) => {
    db.collection('reviews_tvshow').add({
      // movieTitle: movie.original_title,
      tvShowId: match.params.id,
      heading: tvShowHeading,
      rating: tvShowRating,
      tvShowReview: tvShowReview,
      userId: currentUser.uid,
      date: Date.now()
    })
      // .then(() => {
      //   alert('message submitted')
      // })
      .catch(error => {
        alert(error.message)
      })

    e.preventDefault();
  }

  // write review to db
  const [reviewDb, setreviewDb] = useState([])
  const showReviews = async () => {
    db.collection("reviews_tvshow").where("tvShowId", "==", match.params.id)
      .get()
      .then((querySnapshot) => {
        const reviews = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          reviews.push(data)
        });
        setreviewDb(reviews)
      })
  }

  const handleOnChange = (e) => {
    const value = e.target.value;
    setTvShowRating(value)
  }



  const movieDetailStyling = {
    backgroundImage: `url(https://image.tmdb.org/t/p/original/${tvShow.poster_path})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }

  const styledLink = {
    color: '#fff',
    margin: '1rem 0',
  }

  const genres = tvShow.genres

  return (
    <BaseLayout>
      <div style={movieDetailStyling}>
        <div className={styles.linkAndMovieDetailContent}>
          <Link style={styledLink} to='/'>Back to homepage</Link>
          <div>
            <h1>{tvShow.name}</h1>
            <p>{tvShow.overview}</p>
            <p className={styles.rating}>Rating: {tvShow.vote_average}({tvShow.vote_count})</p>
            <GetCastFromTvShow castId={match.params.id} />
            {
              genres && genres.map((g, i) => <p key={i}>{g.name}</p>)
            }
            <button>Add to watchlist</button>
          </div>
        </div>
      </div>

      {currentUser ?
        <div className="page page--sign-up">
          <div className="container">
            <div className="row">
              <div className="col-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6 ">
                <h1 className='mt-5 mb-5 text-center'>Write a review</h1>
                <form className={`d-flex flex-column ${styled.reviewForm}`} onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className='w-100' htmlFor="heading">
                      heading: <input className="form-control" type="text" name='heading' id='heading' value={tvShowHeading} onChange={(e) => setTvShowHeading(e.target.value)} />
                    </label>
                  </div>
                  <div className={`form-group ${styles.formMovieRating}`} onChange={handleOnChange}>

                    <label htmlFor="rating">1</label>
                    <input type="radio" name="rating" value='1' />

                    <label htmlFor="rating">2</label>
                    <input type="radio" name="rating" value='2' />

                    <label htmlFor="rating">3</label>
                    <input type="radio" name="rating" value='3' />

                    <label htmlFor="rating">4</label>
                    <input type="radio" name="rating" value='4' />

                    <label htmlFor="rating">5</label>
                    <input type="radio" name="rating" value='5' />

                    <label htmlFor="rating">6</label>
                    <input type="radio" name="rating" value='6' />

                    <label htmlFor="rating">7</label>
                    <input type="radio" name="rating" value='7' />

                    <label htmlFor="rating">8</label>
                    <input type="radio" name="rating" value='8' />

                    <label htmlFor="rating">9</label>
                    <input type="radio" name="rating" value='9' />

                    <label htmlFor="rating">10</label>
                    <input type="radio" name="rating" value='10' />

                  </div>
                  <div className="form-group">
                    <label className='w-100' htmlFor="review">
                      review: <textarea className="form-control" name="review" id="review" cols="30" rows="10" value={tvShowReview} onChange={(e) => setTvShowReview(e.target.value)}></textarea>
                    </label>
                  </div>
                  <input className="btn btn-primary w-100" type="submit" value="submit review" />
                </form>
              </div>
            </div>
          </div>
        </div >
        :
        <p>Please sign in to write a review. <Link to='/auth/signin'>Sign in</Link></p>
      }
      <Reviews media='tvshow' movieId={match.params.id} />

    </BaseLayout>
  )
}

export default TvShowDetailPage
