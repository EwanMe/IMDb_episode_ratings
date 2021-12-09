import { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const Chart = ({ data, isLoaded, selection, isDynamic, error }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      const allPlots = data.map((item) => createDataPlot(item));
      renderChart(allPlots);
    }
  }, [data]);

  useEffect(() => {
    // TODO: Load new data in first time, and hide them after, not unload.
    // console.log('Chart.js 17: ', props.selection);
    if (chart) {
      const loaded = chart.data();

      loaded.forEach((item) => {
        if (selection.includes(item.id)) {
          chart.show(item.id);
        } else {
          chart.hide(item.id);
        }
      });
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
    console.log('create data plot', data);
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
            //title: (d) => props.data.Episodes[d].Title,
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
      <div className="data-wrapper" style={{ width: '90%' }}>
        {isLoaded && <div id="chart"></div>}
      </div>
    );
  }
};

export default Chart;
