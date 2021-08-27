import { useState, useEffect } from 'react';

const Data = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://www.omdbapi.com/?t=community&season=2&apikey=590114db')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
          console.log(result.Episodes);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <ul>
        {items.Episodes &&
          items.Episodes.map((episode) => (
            <li>
              <h4>{episode.Title}</h4>
              <p>Rating: {episode.imdbRating}</p>
            </li>
          ))}
      </ul>
    );
  }
};

export default Data;
