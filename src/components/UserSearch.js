import SearchBar from './SearchBar';
import Autocomplete from './Autocomplete';
import { useEffect, useState } from 'react';

const UserSearch = (props) => {
  const [showQuery, setShowQuery] = useState('');
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (search.length > 0) {
      fetch(`http://www.omdbapi.com/?s=${search}&type=series&apikey=590114db`)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(result.Response === 'True' ? true : false);
            setItems(result.Search);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [search]);

  useEffect(() => {
    props.getShow(showQuery);
  }, [showQuery]);

  const formatSearch = (string) => {
    const items = string.trim().split(' ');
    return items.join('+');
  };

  return (
    <div style={{ width: '50%', position: 'absolute' }}>
      <SearchBar
        search={(value) => setShowQuery(value)}
        update={(value) => setSearch(formatSearch(value))}
      />
      {items && (
        <Autocomplete
          items={items}
          error={error}
          select={(value) => setShowQuery(value)}
        />
      )}
    </div>
  );
};

export default UserSearch;
