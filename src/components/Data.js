import { useState, useEffect } from "react";
import c3 from "c3";

const Data = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [seasonBtnArray, setSeasonBtnArray] = useState([]);
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
            setSeasonBtnArray(getSeasonArray(result.totalSeasons));
            renderChart(updateChartData(result));
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [props.show, season]);

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

  const updateChartData = (data) => {
    const ratings = data.Episodes.map((ep) => ep.imdbRating);
    ratings.unshift("Season " + data.Season);
    return ratings;
  };

  const renderChart = (data) => {
    c3.generate({
      bindto: "#chart",
      unload: true,
      data: {
        type: "bar",
        columns: [data],
      },
    });
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="data-wrapper">
        <h1>{items.Title}</h1>
        <ul>{seasonBtnArray}</ul>
        {isLoaded && <div id="chart"></div>}
      </div>
    );
  }
};

export default Data;
