const SearchBar = (props) => {
  return (
    <div>
      <input
        type="search"
        name="search-bar"
        placeholder="Search for TV series"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            props.searchShow(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
