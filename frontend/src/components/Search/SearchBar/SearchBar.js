const SearchBar = ({ update, autoSelect }) => {
  return (
    <input
      className="search-bar"
      type="search"
      name="search-bar"
      placeholder="Search for TV series"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          autoSelect(e.target.value); // Automatically selects most relevant show.
          e.target.value = '';
        }
      }}
      onKeyUp={(e) => {
        if (e.key !== 'Enter') {
          update(e.target.value);
        }
      }}
      onClick={(e) => {
        if (e.target.value.length !== 0) {
          update(e.target.value);
        }
      }}
    />
  );
};

export default SearchBar;
