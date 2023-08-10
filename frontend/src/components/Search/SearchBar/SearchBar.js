import SearchIcon from '@mui/icons-material/Search';
import MdCancel from '@mui/icons-material/Cancel';

const SearchBar = ({ update, autoSelect }) => {
  return (
    <>
      <SearchIcon className="search-icon" />
      <button className="cancel-search-icon">
        <MdCancel
          onClick={() => (document.querySelector('.search-bar').value = '')}
        />
      </button>
      <input
        className="search-bar"
        type="search"
        name="search-bar"
        placeholder="Search for TV series"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            autoSelect(e.target.value); // Automatically selects most relevant show.
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
    </>
  );
};

export default SearchBar;
