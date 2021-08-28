import { useState, useEffect } from 'react';

const Data = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState(1);

  useEffect(() => {
    if (props.show.length > 0) {
      fetch(
        `http://www.omdbapi.com/?t=${props.show}&season=${season}&type=series&apikey=590114db`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
            setSeasons(seasonArray(result.totalSeasons));
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [props.show, season]);

  const seasonArray = (num) => {
    let seasons = [];
    for (let i = 0; i < num; ++i) {
      seasons.push(i + 1);
    }
    return seasons;
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="data-wrapper">
        <h1>{items.Title}</h1>
        <ul>
          {seasons.map((i) => (
            <button value={i} onClick={(e) => setSeason(e.target.value)}>
              {i}
            </button>
          ))}
        </ul>
        <ul>
          {items.Episodes &&
            items.Episodes.map((episode) => (
              <li>
                <h4>{episode.Title}</h4>
                <p>Rating: {episode.imdbRating}</p>
              </li>
            ))}
        </ul>
      </div>
    );
  }
};

export default Data;
