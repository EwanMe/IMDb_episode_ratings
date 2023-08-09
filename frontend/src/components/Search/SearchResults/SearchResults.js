import { useEffect, useState } from 'react';
import SearchResultList from './SearchResultList';
import Loader from '../../Layout/Loader';
import NoResults from './NoResults';

const CONFIG = require('../../../api-config.json');

export default function SearchResults({ searchQuery, selectTitle }) {
  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    // Reset items and error on new query
    setItems(null);
    setError(null);

    const getResults = async () => {
      // Fetch data from backend api and append poster link from OMDb api
      try {
        const result = await fetch(
          new URL(`search?q=${searchQuery}`, CONFIG.backend.url)
        );
        const json = await result.json();

        const items = json.map(async (item) => {
          const ombdRes = await fetch(
            new URL(
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
      if (searchQuery?.length > -1) {
        setItems(await getResults());
      }
    };
    fetchData();
  }, [searchQuery]);

  if (items?.length > 0) {
    return (
      <SearchResultList items={items} select={(title) => selectTitle(title)} />
    );
  } else if (items?.length === 0) {
    return <NoResults failedQuery={searchQuery} />;
  } else if (error) {
    return <p>Error: {error}</p>;
  } else {
    return <Loader size="large" />;
  }
}
