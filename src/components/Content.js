import { useState, useEffect } from 'react';
import UserSearch from './UserSearch';
import Chart from './Chart';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState(null);

  const [selection, setSelection] = useState([]);
  const [seasonSelector, setSeasonSelector] = useState([]);
  const [arrayIsBtn, setArrayIsBtn] = useState(true);

  const [dynamicChart, setDynamicChart] = useState(false);

  useEffect(async () => {
    if (show.length > 0) {
      let totalSeasons = 1;
      await fetch(
        `http://www.omdbapi.com/?i=${show}&type=series&apikey=590114db`
      )
        .then((res) => res.json())
        .then((result) => {
          setShowInfo(result);
          totalSeasons = result.totalSeasons;
        })
        .catch((error) => setError(error));

      let queryData = [];
      for (let i = 1; i <= totalSeasons; ++i) {
        await fetch(
          `http://www.omdbapi.com/?i=${show}&season=${i}&type=series&apikey=590114db`
        )
          .then((res) => res.json())
          .then((result) => {
            queryData.push(result);
            // if (i === 1) {
            //   totalSeasons = result.totalSeasons;
            // }
          })
          .catch((error) => setError(error));
      }

      setData(queryData);
      setSeasonSelector(createSeasonArray(totalSeasons));
      setIsLoaded(true);
    }
  }, [show]);

  // TODO: This and replaceSeasonArray should be merged.
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
        <button
          name={`Season ${i}`}
          onClick={() => setSelection([`Season ${i}`])}
        >
          {i}
        </button>
      </li>
    );
  };

  const getCheckbox = (i) => {
    return (
      <li key={i} style={{ listStyle: 'none', display: 'inline' }}>
        <label htmlFor={`Season ${i}`}>{i}</label>
        <input
          id={`season-${i}-checkbox`}
          name={`Season ${i}`}
          type="checkbox"
          onChange={(e) => handleSeasonCheck(e, i)}
        />
      </li>
    );
  };

  const replaceSeasonArray = () => {
    setArrayIsBtn(!arrayIsBtn);

    let newArray = [];
    for (let i = 1; i <= seasonSelector.length; ++i) {
      if (arrayIsBtn) {
        if (i === 1) {
          newArray.push(getCheckbox(i));
          // Do something unique for first since season 1 is
          // selected by default.
          // ... and what would that be?
        } else {
          newArray.push(getCheckbox(i));
        }
      } else {
        newArray.push(getButton(i));
      }
    }

    setSeasonSelector(newArray);
  };

  const handleSeasonCheck = (e, i) => {
    if (e.currentTarget.checked) {
      setSelection((selection) => [...selection, `Season ${i}`].sort());
    } else {
      setSelection((selection) =>
        selection.filter((item) => item !== `Season ${i}`).sort()
      );
    }
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
        {isLoaded && (
          <div
            style={{
              width: '75%',
              height: '200px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <img
              src={showInfo.Poster}
              style={{ minWidth: '100px', maxWidth: '100px', maxHeight: '90%' }}
            />
            <div style={{ margin: 'auto 5%', width: '75%' }}>
              <h1>{showInfo.Title}</h1>
              <p>{showInfo.Year}</p>
              <div
                style={{
                  height: '60px',
                  width: '60px',
                  backgroundColor:
                    showInfo.imdbRating > 8
                      ? '#04724D'
                      : showInfo.imdbRating > 6
                      ? '#EB9C0A'
                      : '#BC2C1A',
                  color: 'white',
                  borderRadius: '10%',
                  fontSize: '1.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {showInfo.imdbRating}
              </div>
            </div>
          </div>
        )}
        <ul className="season-select" style={{ padding: '0' }}>
          {seasonSelector}
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
            selection={selection}
            isDynamic={dynamicChart}
          />
        )}
      </div>
    </main>
  );
};

export default Content;
