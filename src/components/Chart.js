import { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const Chart = (props) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (props.isLoaded) {
      const allPlots = props.data.map((item) => createDataPlot(item));
      renderChart(allPlots);
    }
  }, [props.isLoaded]);

  useEffect(() => {
    // TODO: Load new data in first time, and hide them after, not unload.
    // console.log('Chart.js 17: ', props.selection);
    if (chart) {
      const loaded = chart.data();

      loaded.forEach((item) => {
        if (props.selection.includes(item.id)) {
          chart.show(item.id);
        } else {
          chart.hide(item.id);
        }
      });
    }
  }, [props.selection, chart]);

  useEffect(() => {
    if (chart) {
      if (props.isDynamic) {
        chart.axis.max(undefined);
        chart.axis.min(undefined);
      } else {
        chart.axis.range({ max: { y: 10 }, min: { y: 1 } });
      }
    }
  }, [props.isDynamic]);

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
            //title: (d) => props.data.Episodes[d].Title,
            name: (name) => name,
            value: (name) => 'Rating: ' + name,
          },
        },
      })
    );
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
