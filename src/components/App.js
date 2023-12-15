import {  useState } from "react";
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
import { useMovies } from "./custom/useMovies";
import { useLocalStorage } from "./custom/useLocalStorage";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId,setSelectedId]=useState(null)

  const [setStorage,getStorage] = useLocalStorage()
  const {movies,error,isLoading}=useMovies(query)
  const [watched, setWatched] = useState(()=>{
    return getStorage
  });
  const handleAddWatched=(movie)=>{
    setWatched((watched)=>{
     setStorage([...watched,movie])
     return [...watched,movie]
    })
    handleCloseMovie()
    
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
        setStorage(prevWatchedList)
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
