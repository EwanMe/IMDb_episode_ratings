import { useEffect } from 'react';
import c3 from 'c3';

const Chart = (props) => {
  useEffect(() => {
    if (props.items.Episodes) {
      renderChart(updateChartData(props.items));
    }
  }, [props.items]);

  const updateChartData = (data) => {
    const ratings = data.Episodes.map((ep) => ep.imdbRating);
    ratings.unshift('Season ' + data.Season);
    return ratings;
  };

  const renderChart = (data) => {
    c3.generate({
      bindto: '#chart',
      unload: true,
      data: {
        type: 'line',
        columns: [data],
      },
      axis: {
        y: {
          label: {
            text: 'Rating',
            position: 'outer-middle',
          },
          max: 10,
          min: 1,
        },
        x: {
          label: {
            text: 'Episodes',
            position: 'inner-center',
          },
        },
      },
      color: {
        pattern: ['#f0f'],
      },
    });
  };

  if (props.error) {
    return <p>Error: {props.error.message}</p>;
  } else if (!props.isLoaded || !props.items) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="data-wrapper">
        {props.isLoaded && <div id="chart"></div>}
      </div>
    );
  }
};

export default Chart;
