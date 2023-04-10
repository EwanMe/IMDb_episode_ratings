import SearchBar from './SearchBar';
import Autocomplete from './Autocomplete';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const UserSearch = ({ getShow, setNoResults }) => {
  const [showQuery, setShowQuery] = useState('');
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => {
    // Fetch data from local api and poster from OMDb
    if (search.length > 0) {
      fetch(`http://localhost:8000/search?q=${search}`)
        .then((res) =>
          res.json().then((result) => {
            Promise.all(
              result.map((item) => {
                return fetch(
                  `https://www.omdbapi.com/?i=${item.tconst}&apikey=590114db`
                ).then((res) => res.json());
              })
            ).then((omdbRes) => {
              setItems(() =>
                result.map((item, i) => ({
                  ...item,
                  poster: omdbRes[i].Poster,
                }))
              );
            });
          })
        )
        .catch((error) => setError(error));
    }
  }, [search]);

  useEffect(() => {
    getShow(showQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQuery]);

  useEffect(() => {
    let searchBar = document.querySelector('.search-bar');
    if (showAutocomplete && items) {
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
          if (items) {
            setShowQuery(items[0].tconst); // Default value is first item.
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
      {showAutocomplete && items && (
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
