import { useState, useEffect } from 'react';
import UserSearch from './UserSearch';
import Chart from './Chart';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  const [seasonBtnArray, setSeasonBtnArray] = useState([]);
  const [season, setSeason] = useState(1);

  useEffect(() => {
    // Displays season 1 when querying new show.
    setSeason(1);
  }, [show]);

  useEffect(() => {
    if (show.length > 0) {
      fetch(
        `http://www.omdbapi.com/?t=${show}&season=${season}&type=series&apikey=590114db`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setData(result);
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
    // Generates array of buttons to select seasons from.
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
    <main
      role="main"
      style={{
        width: '70%',
        margin: '3em auto 3em auto',
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <UserSearch getShow={(value) => setShow(value)} />
      <div
        style={{
          width: '100%',
          paddingTop: '3em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: '0', width: '75%' }}>{data.Title}</h1>
        <ul style={{ padding: '0' }}>{seasonBtnArray}</ul>
        {show && <Chart isLoaded={isLoaded} data={data} error={error} />}
      </div>
    </main>
  );
};

export default Content;
