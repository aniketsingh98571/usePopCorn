export default function Search({query,searchInputHandler}){

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