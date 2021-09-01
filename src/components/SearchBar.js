const SearchBar = (props) => {
  return (
    <input
      type="search"
      name="search-bar"
      placeholder="Search for TV series"
      style={{ width: '100%', height: '3em' }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          props.search(e.target.value);
          e.target.value = '';
        }
      }}
      onKeyUp={(e) => {
        props.update(e.target.value);
      }}
    />
  );
};

export default SearchBar;
