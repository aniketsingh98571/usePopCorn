import { useEffect,useRef } from "react"
export default function Search({query,searchInputHandler}){
  const inputFocus=useRef(null)
  useEffect(()=>{
    inputFocus.current.focus()
  },[])
    return (
      <input
      ref={inputFocus}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => searchInputHandler(e)}
    />
    )
  }