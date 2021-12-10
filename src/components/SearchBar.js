const SearchBar = (props) => {
  return (
    <input
      className="search-bar"
      type="search"
      name="search-bar"
      placeholder="Search for TV series"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          props.autoSelect(); // Automatically selects most relevant show.
          e.target.value = '';
        }
      }}
      onKeyUp={(e) => {
        if (e.key !== 'Enter') {
          props.update(e.target.value);
        }
      }}
      onClick={(e) => {
        if (e.target.value.length !== 0) {
          props.update(e.target.value);
        }
      }}
    />
  );
};

export default SearchBar;
