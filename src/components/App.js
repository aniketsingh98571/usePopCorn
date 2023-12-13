import { useEffect, useState } from "react";
import { API_Key } from "./key";
import NavBar from "./NavBar";
import Search from "./Search";
import NumResults from "./NumResults";
import Main from "./Main";
import Box from "./Box";
import SelectedMovie from "./SelectedMovie";
import Loader from "./Loader";
import WatchSummary from "./WatchSummary";
import WatchedMovieList from "./WatchedMovieList";
import MovieList from "./MovieList";
import ErrorMessage from "./ErrorMessage";
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
    const controller =new AbortController()
    searchMoviesHandler(controller)
    return ()=>{
      console.log("aborting")
      controller.abort()
    }
  },[query])
  const handleAddWatched=(movie)=>{
    setWatched((watched)=>{
     return [...watched,movie]
    })
    handleCloseMovie()
  }
  const searchMoviesHandler=async(controller)=>{
    if(query.length<3){
      setMovies([])
      setError("")
      return
    }
    clearTimeout(timer);
   const timerTemp=setTimeout(async()=>{
      console.log(":run")
      try{
        const searchData=await fetch(`http://www.omdbapi.com/?apikey=${API_Key}&s=${query}`,{signal:controller.signal})
        const results=await searchData.json()
        console.log(results)
        if(results.Response==='False'){ throw new Error('Movie Not Found')}
        setMovies(results.Search)
        }
        catch(err){
          if(err.name!=="AbortError")
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
