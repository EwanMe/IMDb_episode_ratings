import SearchBar from './SearchBar';
import Autocomplete from './Autocomplete';
import { useEffect, useState } from 'react';

const UserSearch = ({ getShow }) => {
  const [showQuery, setShowQuery] = useState('');
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [items, setItems] = useState(['']);
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
    if (showAutocomplete) {
      searchBar.style.borderRadius = '27px 27px 0 0';
      searchBar.style.borderBottom = 'none';
    } else {
      searchBar.removeAttribute('style');
    }
  }, [showAutocomplete]);

  const formatSearch = (string) => {
    return string.trim().split(' ').join('+');
  };

  return (
    <div className="search-wrapper">
      <SearchBar
        autoSelect={() => {
          setShowQuery(items[0].imdbID); // Default value is first item.
          setShowAutocomplete(false);
        }}
        update={(value) => {
          setSearch(formatSearch(value));
          setShowAutocomplete(true);
        }}
      />
      {showAutocomplete && (
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
