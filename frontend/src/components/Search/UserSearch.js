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
    const getResults = async () => {
      // Fetch data from backend api and append poster link from OMDb api
      try {
        const result = await fetch(`http://localhost:8000/search?q=${search}`);
        const json = await result.json();

        const items = json.map(async (item) => {
          const ombdRes = await fetch(
            `https://www.omdbapi.com/?i=${item.tconst}&apikey=590114db`
          );
          const omdbJson = await ombdRes.json();

          return {
            ...item,
            poster: omdbJson.Poster,
          };
        });

        return Promise.all(items);
      } catch (error) {
        setError(error);
      }
    };

    const fetchData = async () => {
      if (search.length > 0) {
        setItems(await getResults());
      }
    };
    fetchData();
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
