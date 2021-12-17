import { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const Chart = ({ data, isLoaded, selection, isDynamic, error }) => {
  const [chart, setChart] = useState(null);

  const colors = [
    '#478EFF',
    '#FF5353',
    '#4B9C3B',
    '#CF8D3C',
    '#7157FF',
    '#FAE739',
    '#3AD3E0',
    '#FF68FF',
  ]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  useEffect(() => {
    if (isLoaded) {
      const allPlots = data.map((item) => createDataPlot(item));
      renderChart(allPlots);
    }
  }, [isLoaded, data]);

  useEffect(() => {
    // TODO: Load new data in first time, and hide them after, not unload.
    if (chart) {
      const loaded = chart.data();

      loaded.forEach((item) => {
        if (selection.includes(item.id)) {
          chart.show(item.id);
        } else {
          chart.hide(item.id);
        }
      });
      chart.tooltip = 'Test';
    }
  }, [selection, chart]);

  useEffect(() => {
    if (chart) {
      if (isDynamic) {
        chart.axis.max(undefined);
        chart.axis.min(undefined);
      } else {
        chart.axis.range({ max: { y: 10 }, min: { y: 1 } });
      }
    }
  }, [isDynamic]);

  const createDataPlot = (data) => {
    const ratings = data.Episodes.map((ep) => ep.imdbRating);
    ratings.unshift('Season ' + data.Season); // Data array starts with label name
    return ratings;
  };

  const renderChart = (plots) => {
    setChart(
      c3.generate({
        bindto: '#chart',
        unload: true,
        data: {
          type: 'line',
          columns: plots,
        },
        axis: {
          y: {
            label: {
              text: 'Rating',
              position: 'outer-middle',
            },
            max: isDynamic ? undefined : 10,
            min: isDynamic ? undefined : 1,
          },
          x: {
            label: {
              text: 'Episode',
              position: 'inner-center',
            },
            tick: {
              format: (x) => x + 1, // x-axis starts on episode 1
            },
          },
        },
        color: {
          pattern: colors,
        },
        tooltip: {
          format: {
            title: (episode) =>
              selection.map((item) => {
                const episodes = data[item.split(' ').slice(-1) - 1].Episodes;
                if (episode < episodes.length) return episodes[episode].Title;
                return 'N/A';
              }),
            name: (name) => name,
            value: (name) => 'Rating: ' + name,
          },
        },
      })
    );
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded || !data) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="chart-wrapper">{isLoaded && <div id="chart"></div>}</div>
    );
  }
};

export default Chart;
