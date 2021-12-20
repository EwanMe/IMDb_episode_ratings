import { useState, useEffect } from 'react';
import UserSearch from './Search/UserSearch';
import Chart from './Chart/Chart';
import ShowCard from './ShowInfo/ShowCard';
import ChartControls from './Chart/ChartControls';

const Content = () => {
  const [show, setShow] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState([]);

  const [selection, setSelection] = useState([]);
  const [seasonSelector, setSeasonSelector] = useState([]);

  const [comparison, setComparison] = useState(false);
  const [dynamicChart, setDynamicChart] = useState(false);

  useEffect(async () => {
    // Fetch show data from OMDb API.
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
      createSeasonSelector(totalSeasons);
      setIsLoaded(true);
    }
  }, [show]);

  useEffect(() => {
    // Default season selection.
    setSelection(['Season 1']);
  }, [data]);

  useEffect(() => {
    // Update classes for season selector to change styling on selected tabs.
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
    createSeasonSelector();
  }, [comparison]);

  const createSeasonSelector = (numSeasons) => {
    if (numSeasons === undefined) numSeasons = showInfo.totalSeasons;

    let newArray = [];
    for (let i = 1; i <= numSeasons; ++i) {
      if (comparison) {
        newArray.push(getCheckbox(i));
      } else {
        newArray.push(getButton(i));
      }
    }

    setSeasonSelector(newArray);
  };

  const getButton = (i) => {
    return (
      <li key={i}>
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
      <li key={i}>
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
          <ShowCard
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
