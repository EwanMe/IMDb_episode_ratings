import { useState, useEffect } from 'react';
import UserSearch from './Search/UserSearch';
import Chart from './Chart';
import ShowInfo from './ShowInfo/ShowInfo';
import ChartControls from './ChartControls/ChartControls';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState(null);

  const [selection, setSelection] = useState([]);
  const [seasonSelector, setSeasonSelector] = useState([]);

  const [comparison, setComparison] = useState(false);
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
          })
          .catch((error) => setError(error));
      }

      setData(queryData);
      setSeasonSelector(createSeasonArray(totalSeasons));
      setIsLoaded(true);
    }
  }, [show]);

  useEffect(() => {
    setSelection(['Season 1']);
  }, [data]);

  useEffect(() => {
    if (show) {
      const seasonList = [...document.querySelector('.season-select').children];
      if (seasonList.length) {
        seasonList.forEach((item) => {
          let button = item.children[0];
          if (selection.includes(button.getAttribute('name'))) {
            button.classList.add('selected');
          } else {
            button.classList.remove('selected');
          }
        });
      }
    }
  }, [selection, seasonSelector]);

  useEffect(() => {
    replaceSeasonArray();
  }, [comparison]);

  // TODO: This and replaceSeasonArray should be merged.
  const createSeasonArray = (num) => {
    // Generates array of buttons to select seasons from.
    let seasons = [];
    for (let i = 1; i <= num; ++i) {
      seasons.push(getButton(i));
    }
    return seasons;
  };

  const getButton = (i) => {
    return (
      <li key={i} style={{ listStyle: 'none', display: 'inline' }}>
        <button
          name={`Season ${i}`}
          id={`season-${i}-button`}
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
    let newArray = [];
    for (let i = 1; i <= seasonSelector.length; ++i) {
      if (comparison) {
        newArray.push(getCheckbox(i));
      } else {
        newArray.push(getButton(i));
      }
    }

    setSeasonSelector(newArray);
  };

  const handleSeasonCheck = (e, i) => {
    if (e.currentTarget.checked) {
      if (!selection.includes(`Season ${i}`)) {
        setSelection((selection) => [...selection, `Season ${i}`].sort());
      }
    } else {
      setSelection((selection) =>
        selection.filter((item) => item !== `Season ${i}`).sort()
      );
    }
  };

  return (
    <main role="main">
      <UserSearch getShow={(value) => setShow(value)} />
      <div className="content-wrapper">
        {isLoaded && (
          <ShowInfo
            title={showInfo.Title}
            poster={showInfo.Poster}
            year={showInfo.Year}
            rating={showInfo.imdbRating}
            genre={showInfo.Genre}
            actors={showInfo.Actors}
            writers={showInfo.Writer}
            plot={showInfo.Plot}
          />
        )}
        {show && (
          <div className="global-chart-wrapper">
            <ChartControls
              setComparison={(e) => setComparison(e)}
              setDynamicChart={(e) => setDynamicChart(e)}
            />
            <ul className="season-select">{seasonSelector}</ul>
            <Chart
              isLoaded={isLoaded}
              data={data}
              error={error}
              selection={selection}
              isDynamic={dynamicChart}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Content;
