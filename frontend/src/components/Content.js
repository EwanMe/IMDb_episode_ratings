import { useState, useEffect } from 'react';
import Chart from './Chart/Chart';
import ShowCard from './ShowInfo/ShowCard';
import ChartControls from './Chart/ChartControls';

export default function Content({ show }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState([]);

  const [selection, setSelection] = useState([]);
  const [seasonSelector, setSeasonSelector] = useState([]);

  const [comparison, setComparison] = useState(false);
  const [dynamicChart, setDynamicChart] = useState(false);
  const [allEpisodes, setAllEpisodes] = useState(false);

  const CONFIG = require('../api-config.json');

  useEffect(() => {
    async function fetchData() {
      // Fetch show data from OMDb API.
      if (show?.length > 0 && !Number.isInteger(show)) {
        let totalSeasons = 1;
        await fetch(
          new URL(
            `?i=${show}&type=series&apikey=${CONFIG.omdbApi.apikey}`,
            CONFIG.omdbApi.url
          )
        )
          .then((res) => res.json())
          .then((result) => {
            setShowInfo(result);
            totalSeasons = result.totalSeasons;
          })
          .catch((error) => setError(error));

        let queryData = [];
        await fetch(new URL(`ratings/${show}/`, CONFIG.backend.url))
          .then((res) => res.json())
          .then((result) => {
            queryData = result.seasons;
          })
          .catch((error) => setError(error));

        setData(queryData);
        createSeasonSelector(totalSeasons);
        setIsLoaded(true);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    // Default season selection.
    setSelection(['Season 1']);

    const selectorStyle = document.querySelector('.season-select').style;
    if (isLoaded) {
      setComparison(false);
      document.querySelector('.switch-checkbox').checked = false;
      selectorStyle.visibility = 'visible';
    } else {
      selectorStyle.visibility = 'hidden';
    }
  }, [data, isLoaded]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, seasonSelector]);

  useEffect(() => {
    createSeasonSelector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparison, allEpisodes]);

  useEffect(() => {
    setComparison(false);
    const comparisonSwitch = document.getElementById('compare-switch');
    if (comparisonSwitch) {
      comparisonSwitch.checked = false;
      comparisonSwitch.disabled = !comparisonSwitch.disabled;
      comparisonSwitch.classList.toggle('switch-disabled');
    }
  }, [allEpisodes]);

  useEffect(() => {
    if (comparison) {
      selection.forEach((item) => {
        const i = item.split(' ').slice(-1);
        const checkbox = document.querySelector(`#season-${i}-checkbox`);
        if (checkbox) {
          checkbox.checked = true;
        }
        document.getElementById(`season-${i}-tab`)?.classList.add('selected');
      });
    } else {
      // Remove styling from selected tabs
      Array.from(document.getElementsByClassName('season-tab')).forEach(
        (elem) => elem.classList.remove('selected')
      );

      setSelection((selection) =>
        allEpisodes ? ['Season 1'] : [selection[0]]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonSelector]);

  const createSeasonSelector = (numSeasons = showInfo.totalSeasons) => {
    let newArray = [];
    if (allEpisodes) {
      newArray.push(createButton(1, 'All', { disabled: true }));
    } else {
      for (let i = 1; i <= numSeasons; ++i) {
        if (comparison) {
          newArray.push(createCheckbox(i));
        } else {
          newArray.push(createButton(i));
        }
      }
    }

    setSeasonSelector(newArray);
  };

  const createButton = (i, name = null, props = null) => {
    return (
      <li key={i} className={`season-${i}-tab`}>
        <button
          {...props}
          name={`Season ${i}`}
          id={`season-${i}-button`}
          onClick={() => setSelection([`Season ${i}`])}
        >
          {name ? name : i}
        </button>
      </li>
    );
  };

  const createCheckbox = (i) => {
    return (
      <li key={i} id={`season-${i}-tab`} className="season-tab">
        <label>
          <input
            id={`season-${i}-checkbox`}
            name={`Season ${i}`}
            type="checkbox"
            onChange={(e) => handleSeasonCheck(e, i)}
          />
          {i}
        </label>
      </li>
    );
  };

  const handleSeasonCheck = (e, i) => {
    document.getElementById(`season-${i}-tab`).classList.toggle('selected');

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

  function getChartData() {
    if (allEpisodes) {
      return [data.reduce((accum, season) => accum.concat(season), [])];
    }
    return data;
  }

  return (
    <>
      {isLoaded && (
        <div className="info-wrapper">
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
          <ChartControls
            setComparison={(e) => setComparison(e)}
            setDynamicChart={(e) => setDynamicChart(e)}
            setAllEpisodes={() => setAllEpisodes(!allEpisodes)}
          />
        </div>
      )}
      {show && (
        <div className="global-chart-wrapper">
          <ul className="season-select">{seasonSelector}</ul>
          <Chart
            isLoaded={isLoaded}
            data={getChartData()}
            error={error}
            selection={selection}
            isDynamic={dynamicChart}
            allEpisodes={allEpisodes}
          />
        </div>
      )}
    </>
  );
}
