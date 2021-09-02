import { useEffect } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const Chart = (props) => {
  useEffect(() => {
    if (props.data.Episodes) {
      renderChart(updateChartData(props.data));
    }
  }, [props.data, props.isDynamic]);

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
          max: props.isDynamic ? undefined : 10,
          min: props.isDynamic ? undefined : 1,
        },
        x: {
          label: {
            text: 'Episodes',
            position: 'inner-center',
          },
          tick: {
            format: (x) => x + 1, // x-axis starts on episode 1
          },
        },
      },
      color: {
        pattern: [
          '#478EFF',
          '#FF5353',
          '#7AFF60',
          '#FFAE4B',
          '#7157FF',
          '#FAFF5B',
          '#43EFFF',
          '#FF68FF',
        ],
      },
      tooltip: {
        format: {
          title: (d) => props.data.Episodes[d].Title,
          name: (name, ratio, id, index) => name,
          value: (name, ratio, id, index) => 'Rating: ' + name,
        },
      },
    });
  };

  if (props.error) {
    return <p>Error: {props.error.message}</p>;
  } else if (!props.isLoaded || !props.data) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="data-wrapper" style={{ width: '90%' }}>
        {props.isLoaded && <div id="chart"></div>}
      </div>
    );
  }
};

export default Chart;
