import { useState,useEffect } from "react";
export function useMovies(query){
    const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const [timer,setTimer]=useState(null)
  const [movies, setMovies] = useState([]);
  useEffect(()=>{
    const controller =new AbortController()
    searchMoviesHandler(controller)
    return ()=>{
      console.log("aborting")
      controller.abort()
    }
  },[query])
useEffect(()=>{
   fetchMovies()
},[])
useEffect(()=>{
    const controller =new AbortController()
    return ()=>{
    console.log("aborting")
    controller.abort()
    }
},[query])
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
        const searchData=await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_Key}&s=${query}`,{signal:controller.signal})
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
async function fetchMovies(){
    try{
      setIsLoading(true)
     const data=await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=interstellar`)
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
    return {movies,isLoading,error}
}