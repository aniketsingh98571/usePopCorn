import { useEffect, useState } from "react";
import {API_Key} from './custom/key'
import NavBar from './header/NavBar';
import Search from "./header/Search";
import NumResults from "./header/NumResults";
import Main from "./Main";
import Box from "./Box";
import SelectedMovie from "./movie/SelectedMovie";
import Loader from "./custom/Loader";
import WatchSummary from "./summary/WatchSummary";
import WatchedMovieList from "./summary/WatchedMovieList";
import MovieList from "./movie/MovieList";
import ErrorMessage from "./custom/ErrorMessage";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const [query, setQuery] = useState("");
  const [selectedId,setSelectedId]=useState(null)
  const [timer,setTimer]=useState(null)
  const [watched, setWatched] = useState(()=>{
    const storedValue=localStorage.getItem('watched')
    return JSON.parse(storedValue)
  });
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
     localStorage.setItem('watched',JSON.stringify([...watched,movie]))
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
       const prevWatchedList= prevWatched.filter((currMovie)=>{
          return currMovie.imdbID!==id
        })
        localStorage.setItem('watched',JSON.stringify(prevWatchedList))
        return prevWatchedList
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
