import { useEffect, useState } from "react";
import { API_Key } from "./key";
import StarRating from './StarRating'
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
function Logo(){
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}
function NumResults({movies}){
  return (
    <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
  )
}
function NavBar({children}){
 return (
    <nav className="nav-bar">
        <Logo/>
      {children}
  </nav>
  )
}
function Search({query,searchInputHandler}){

  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => searchInputHandler(e)}
  />
  )
}
function Movie({movie,handleSelectedMovie}){
  return (
    <li onClick={()=>handleSelectedMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  )
}
function MovieList({movies,handleSelectedMovie}){
  return (
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} handleSelectedMovie={handleSelectedMovie} key={movie.imdbID} />
    ))}
  </ul>
  )
}
function Box({children}){
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  )
}
function WatchSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}
function WatchedList({movie,handleDeletedWatched}){
  return (
    <li>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <button className="btn-delete" onClick={()=>handleDeletedWatched(movie.imdbID)}>X</button>
    </div>
  </li>
  )
}
function WatchedMovieList({watched,handleDeletedWatched}){
  return (
    <ul className="list">
    {watched.map((movie) => (
      <WatchedList handleDeletedWatched={handleDeletedWatched} movie={movie}  key={movie.imdbID}/>
    ))}
  </ul>
  )
}
function Main({children}){
return (
    <main className="main">
      {children}
    </main>
  )
}
function Loader(){
  return <p className="loader">Loading...</p>
}
function SelectedMovie({selectedId,handleCloseMovie,handleAddWatched,watched}){
  const [movie,setMovie]=useState({})
  const [isLoading,setIsLoading]=useState(false)
  const [userRating,setUserRating]=useState("")
  const isWatched=watched.map(movie=>movie.imdbID).includes(selectedId)
  const watchedUserRating=watched.find((movie)=>movie.imdbID===selectedId)?.userRating
  console.log(isWatched)
  useEffect(()=>{
    getSelectedMovie()
  },[selectedId])
  const getSelectedMovie=async()=>{
    setIsLoading(true)
    const res=await fetch(`https://www.omdbapi.com/?apiKey=${API_Key}&i=${selectedId}`)
    const data=await res.json()
    console.log(data)
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
function ErrorMessage({message}){
  return (
    <p className="error">
      <span>🛑</span>{message}
    </p>
  )
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const [query, setQuery] = useState("");
  const [selectedId,setSelectedId]=useState(null)
  const [timer,setTimer]=useState(null)
  async function fetchMovies(){
  try{
    setIsLoading(true)
   const data=await fetch(`http://www.omdbapi.com/?apikey=${API_Key}&s=interstellar`)
   if(!data.ok) throw new Error("Something went wrong")
   const results=await data.json()
   if(results.Response==='False') throw new Error('Movie Not Found')
   setMovies(results.Search)
  }
  catch(err){
    setError(err.message)
  }
  finally{
    setIsLoading(false)
  }
  }
  useEffect(()=>{
   fetchMovies()
  },[])
  useEffect(()=>{
    searchMoviesHandler()
  },[query])
  const handleAddWatched=(movie)=>{
    setWatched((watched)=>{
     return [...watched,movie]
    })
    handleCloseMovie()
  }
  const searchMoviesHandler=async()=>{
  
    if(query.length<3){
      setMovies([])
      setError("")
      return
    }
    clearTimeout(timer);
   const timerTemp=setTimeout(async()=>{
      console.log(":run")
      try{
        const searchData=await fetch(`http://www.omdbapi.com/?apikey=${API_Key}&s=${query}`)
        const results=await searchData.json()
        console.log(results)
        if(results.Response==='False'){ throw new Error('Movie Not Found')}
        setMovies(results.Search)
        }
        catch(err){
          setError(err.message)
        }
        finally{
          setIsLoading(false)
        }
    },1000)
    setTimer(timerTemp)
  }
 
  const searchInputHandler=async(e)=>{
    setQuery(e.target.value)
    console.log(e.target.value)
    }
    const handleSelectedMovie=(id)=>{
      console.log(id)
      setSelectedId((prevId)=>{
        if(id===prevId){
          return null
        }
        return id
      } )
    }
    const handleDeletedWatched=(id)=>{
      console.log(id)
      setWatched((prevWatched)=>{
       return prevWatched.filter((currMovie)=>{
          return currMovie.imdbID!==id
        })
      })
    }
    const handleCloseMovie=()=>{
      setSelectedId(null)
    }
  return (
    <>
      <NavBar>   {/*Component Composition to avoid props drilling*/ }
         <Search query={query} searchInputHandler={searchInputHandler} />
         <NumResults  movies={movies}/> 
      </NavBar>
      <Main>
        <Box>
           { isLoading&&<Loader/>}
           {!isLoading&&!error&&<MovieList handleSelectedMovie={handleSelectedMovie} movies={movies}/>}
           {error&&<ErrorMessage message={error}/>}
        </Box>
         <Box>
          {
            selectedId?
            <SelectedMovie watched={watched} handleCloseMovie={handleCloseMovie} selectedId={selectedId} handleAddWatched={handleAddWatched}/>:
            <>
            <WatchSummary watched={watched}/>
            <WatchedMovieList handleDeletedWatched={handleDeletedWatched} watched={watched}/>
           </>
          }
         </Box>
      </Main>
    </>
  );
}
