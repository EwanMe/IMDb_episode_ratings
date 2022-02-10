import SearchBar from './SearchBar';
import Autocomplete from './Autocomplete';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const UserSearch = ({ getShow, setNoResults }) => {
  const [showQuery, setShowQuery] = useState('');
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => {
    if (search.length > 0) {
      fetch(`https://www.omdbapi.com/?s=${search}&type=series&apikey=590114db`)
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.Response !== 'False') {
              setItems(result.Search);
            }
          },
          (error) => {
            setError(error);
          }
        );
    }
  }, [search]);

  useEffect(() => {
    getShow(showQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQuery]);

  useEffect(() => {
    let searchBar = document.querySelector('.search-bar');
    if (showAutocomplete && items[0]) {
      searchBar.classList.add('active-search');
    } else {
      searchBar.classList.remove('active-search');
    }
  }, [showAutocomplete, items]);

  const formatSearch = (string) => {
    return string.trim().split(' ').join('+');
  };

  return (
    <div className="search-wrapper">
      <SearchIcon className="search-icon" />
      <SearchBar
        autoSelect={() => {
          if (items[0] && showQuery) {
            setShowQuery(items[0].imdbID); // Default value is first item.
            setShowAutocomplete(false);
          } else {
            setNoResults(search);
          }
        }}
        update={(value) => {
          setSearch(formatSearch(value));
          setShowAutocomplete(true);
        }}
      />
      {showAutocomplete && items[0] && (
        <Autocomplete
          items={items}
          error={error}
          select={(value) => setShowQuery(value)}
          exists={(value) => setShowAutocomplete(value)}
        />
      )}
    </div>
  );
};

export default UserSearch;
