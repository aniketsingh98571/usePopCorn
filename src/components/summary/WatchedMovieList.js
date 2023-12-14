import WatchedList from "./WatchedList"
export default function WatchedMovieList({watched,handleDeletedWatched}){
    return (
      <ul className="list">
      {watched.map((movie) => (
        <WatchedList handleDeletedWatched={handleDeletedWatched} movie={movie}  key={movie.imdbID}/>
      ))}
    </ul>
    )
  }
  