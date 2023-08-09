import SearchBar from './SearchBar';
import Autocomplete from './Autocomplete';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const CONFIG = require('/app/src/api-config.json');

const UserSearch = ({ getShow, getQuery, setNoResults }) => {
  const [showQuery, setShowQuery] = useState('');
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Decide if autocomplete should continue to talk to database
  /*useEffect(() => {
    const getResults = async () => {
      // Fetch data from backend api and append poster link from OMDb api
      try {
        const result = await fetch(
          // TODO: URLparams?
          new URL(`search?q=${search}`, CONFIG.backend.url)
        );
        const json = await result.json();

        const items = json.map(async (item) => {
          const ombdRes = await fetch(
            new URL(
              // TODO: URLparams?
              `?i=${item.tconst}&apikey=${CONFIG.omdbApi.apikey}`,
              CONFIG.omdbApi.url
            )
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
      if (search.length > -1) {
        setItems(await getResults());
      }
    };
    fetchData();
  }, [search]);*/

  useEffect(() => {
    getShow(showQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQuery]);

  // Change search bar borders when autocomplete is visible
  useEffect(() => {
    const searchBar = document.querySelector('.search-bar');
    const autocomplete = document.querySelector('.autocomplete-list');

    if (autocomplete !== null) {
      searchBar.classList.add('active-search');
    } else {
      searchBar.classList.remove('active-search');
    }
  }, [showAutocomplete, items]);

  useEffect(() => {
    if ((search.length > 0 && !items) || !(showAutocomplete && items)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [showAutocomplete, items, search]);

  useEffect(() => {
    setItems(null);
  }, [search]);

  const formatSearch = (string) => {
    return string.trim().split(' ').join('+');
  };

  return (
    <div className="search-wrapper">
      <SearchIcon className="search-icon" />
      <SearchBar
        autoSelect={(value) => {
          getQuery(value);
          if (items) {
            setShowQuery(items[0].tconst); // Default value is first item.
            setShowAutocomplete(false);
          } else {
            //setNoResults(search);
          }
        }}
        update={(value) => {
          setSearch(formatSearch(value));
          setShowAutocomplete(true);
        }}
      />
      {/*showAutocomplete && (
        <Autocomplete
          items={items}
          error={error}
          isLoading={isLoading}
          select={(value) => setShowQuery(value)}
          exists={(value) => setShowAutocomplete(value)}
        />
      )*/}
    </div>
  );
};

export default UserSearch;
