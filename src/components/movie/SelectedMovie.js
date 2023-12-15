import { useState,useEffect } from "react"
import StarRating from "../custom/StarRating"
import Loader from "../custom/Loader"
export default function SelectedMovie({selectedId,handleCloseMovie,handleAddWatched,watched}){
    const [movie,setMovie]=useState({})
    const [isLoading,setIsLoading]=useState(false)
    const [userRating,setUserRating]=useState("")
    const isWatched=watched.map(movie=>movie.imdbID).includes(selectedId)
    const watchedUserRating=watched.find((movie)=>movie.imdbID===selectedId)?.userRating
    console.log(isWatched)
    useEffect(()=>{
      getSelectedMovie()
      return ()=>{
        document.title="usePopcorn"
      }
    },[selectedId])
    const getSelectedMovie=async()=>{
      setIsLoading(true)
      const res=await fetch(`https://www.omdbapi.com/?apiKey=${process.env.REACT_APP_API_Key}&i=${selectedId}`)
      const data=await res.json()
      console.log(data)
      document.title = `Movie | ${data.Title}`;
      setMovie(data)
      setIsLoading(false)
    }
    const onAddMovie=()=>{
      const addMovieData={
        imdbID:selectedId,
        Title:movie.Title,
        year:movie.Year,
        Poster:movie.Poster,
        imdbRating:Number(movie.imdbRating),
        runtime:movie.Runtime.split(" ").at((0)),
        userRating:Number(userRating)
      }
      handleAddWatched(addMovieData)
    }
    return (
      <div className="details">
        {isLoading?<Loader/>:
        <>
        <header>
        <button className="btn-back" onClick={handleCloseMovie}>
          &larr;
        </button>
        <img src={movie.Poster} alt={`Poster of ${movie.Title}`}/>
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>{movie.Released} &bull; {movie.Runtime}  </p>
          <p>{movie.Genre}</p>
          <p><span>🌟</span>
          {movie.imdbRating}
          </p>
        </div>
        </header>
        
        <section>
        <div className="rating">
          {!isWatched?<> <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
         {Number(userRating)>0&&<button className="btn-add" onClick={onAddMovie}>+ Add to List</button>}</>:<p>You rated this movie {watchedUserRating} 🌟</p>}
         </div>
          <p><em>{movie.Plot}</em></p>
          <p>Starring {movie.Actors}</p>
          <p>Directed by {movie.Director}</p>
        </section>
        </>
  }
      </div>
    )
  }