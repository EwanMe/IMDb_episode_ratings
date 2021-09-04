import { useState, useEffect, createElement } from 'react';
import UserSearch from './UserSearch';
import Chart from './Chart';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  const [season, setSeason] = useState(1);
  const [seasonArray, setSeasonArray] = useState([]);
  const [arrayIsBtn, setArrayIsBtn] = useState(true);

  const [dynamicChart, setDynamicChart] = useState(false);

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
            setSeasonArray(createSeasonArray(result.totalSeasons));
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [show, season]);

  const createSeasonArray = (num) => {
    // Generates array of buttons to select seasons from.
    let seasons = [];
    for (let i = 1; i <= num; ++i) {
      seasons.push(getButton(i));
    }
    setArrayIsBtn(true);
    return seasons;
  };

  const getButton = (i) => {
    return (
      <li key={i} style={{ listStyle: 'none', display: 'inline' }}>
        <button value={i} onClick={(e) => setSeason(e.target.value)}>
          {i}
        </button>
      </li>
    );
  };

  const getCheckbox = (i) => {
    return (
      <li key={i} style={{ listStyle: 'none', display: 'inline' }}>
        <input type="checkbox" value={i} />
      </li>
    );
  };

  const replaceSeasonArray = () => {
    setArrayIsBtn(!arrayIsBtn);

    let newArray = [];
    for (let i = 1; i <= seasonArray.length; ++i) {
      if (arrayIsBtn) {
        newArray.push(getCheckbox(i));
      } else {
        newArray.push(getButton(i));
      }
    }

    setSeasonArray(newArray);
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
        <ul className="season-array" style={{ padding: '0' }}>
          {seasonArray}
        </ul>
        <button onClick={() => replaceSeasonArray()}>Compare</button>
        <button onClick={() => setDynamicChart(!dynamicChart)}>
          Toggle static/dynamic
        </button>
        {show && (
          <Chart
            isLoaded={isLoaded}
            data={data}
            error={error}
            isDynamic={dynamicChart}
          />
        )}
      </div>
    </main>
  );
};

export default Content;
