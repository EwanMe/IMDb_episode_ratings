const SearchBar = (props) => {
  return (
    <div style={{ width: '50%' }}>
      <input
        type="search"
        name="search-bar"
        placeholder="Search for TV series"
        style={{ width: '100%', height: '3em' }}
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
