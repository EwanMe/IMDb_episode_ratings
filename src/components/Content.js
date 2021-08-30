import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Chart from './Chart';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const [seasonBtnArray, setSeasonBtnArray] = useState([]);
  const [season, setSeason] = useState(1);

  useEffect(() => {
    if (show.length > 0) {
      fetch(
        `http://www.omdbapi.com/?t=${show}&season=${season}&type=series&apikey=590114db`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
            setSeasonBtnArray(getSeasonArray(result.totalSeasons));
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [show, season]);

  const getSeasonArray = (num) => {
    let seasons = [];
    for (let i = 1; i <= num; ++i) {
      seasons.push(
        <button key={i} value={i} onClick={(e) => setSeason(e.target.value)}>
          {i}
        </button>
      );
    }
    return seasons;
  };

  return (
    <main>
      <SearchBar searchShow={(value) => setShow(value)} />
      <h1>{items.Title}</h1>
      <ul>{seasonBtnArray}</ul>
      {show && <Chart isLoaded={isLoaded} items={items} error={error} />}
    </main>
  );
};

export default Content;
